import { json } from '@sveltejs/kit'
import { parse } from 'csv-parse'
import { generateId } from 'lucia'
import { ensureAdmin } from '$lib/server/auth'
import { convexHttp } from '$lib/server/convex'
import { deleteOneProduct } from '$lib/server/data/products.js'
import { api } from '../../../../convex/_generated/api'

export const DELETE = async ({ locals, url }) => {
	ensureAdmin(locals)

	const productId = url.searchParams.get('productId')

	if (!productId) {
		return json(
			{ message: 'missing product id...' },
			{
				status: 400
			}
		)
	}

	await deleteOneProduct(productId)

	return new Response('success')
}

type CSVRecord = {
	'Price ID': string
	'Product ID': string
	'Product Name': string
	'Product Statement Descriptor': string
	'Product Tax Code': string
	Description: string
	'Created (UTC)': string
	Amount: number
	Currency: string
	Interval: string
	'Interval Count': number
	'Usage Type': string
	'Aggregate Usage': string
	'Billing Scheme': string
	'Trial Period Days': number
	'Tax Behavior': string
	Code: string
	Width: number
	Height: number
}

async function parseCSV(csvFile: File): Promise<CSVRecord[]> {
	return new Promise((resolve, reject) => {
		const results: CSVRecord[] = []
		const textDecoder = new TextDecoder('utf-8')
		const csvParseStream = parse({ delimiter: ',', columns: true })

		const reader = csvFile.stream().getReader()

		const readChunk = async (): Promise<void> => {
			const { done, value } = await reader.read()
			if (done) {
				csvParseStream.end()
			} else {
				const chunkString = textDecoder.decode(value)
				csvParseStream.write(chunkString)
				await readChunk()
			}
		}

		reader.read().then(async ({ done, value }) => {
			if (!done && value) {
				const chunkString = textDecoder.decode(value)
				csvParseStream.write(chunkString)
				await readChunk()
			}
		})

		csvParseStream.on('readable', () => {
			let record
			while ((record = csvParseStream.read())) {
				results.push(record as CSVRecord)
			}
		})

		csvParseStream.on('error', (error) => {
			reject(error)
		})

		csvParseStream.on('end', () => {
			resolve(results)
		})
	})
}

export const POST = async ({ locals, request }) => {
	ensureAdmin(locals)

	const formData = await request.formData()
	const priceFile = formData.get('prices') as File

	if (!priceFile) {
		return json({ success: false, error: 'No file provided' }, { status: 400 })
	}

	const csvData = await parseCSV(priceFile)

	const createdProducts: {
		name: string
		id: string
	}[] = []

	for (const entry of csvData) {
		const entryProductName = entry['Product Name'].split(',')[0] ?? ''

		const productIdx = createdProducts.findIndex((v) => v.name === entryProductName)

		const newSize = {
			code: entry.Code,
			name: entry['Product Name'].split(',')[1]?.trim() ?? '',
			isAvailable: true,
			width: entry.Width,
			height: entry.Height,
			price: entry.Amount * 100,
			stripePriceId: entry['Price ID'],
			stripeProductId: entry['Product ID'],
			productId: ''
		}

		if (productIdx >= 0) {
			// 产品已存在，追加尺寸
			const existingProduct = await convexHttp.query(api.products.getById, {
				id: createdProducts[productIdx].id
			})
			if (existingProduct) {
				const updatedSizes = [...existingProduct.sizes, { ...newSize, productId: existingProduct.id }]
				await convexHttp.mutation(api.products.update, {
					id: existingProduct.id,
					patch: { sizes: updatedSizes }
				})
			}
		} else {
			// 创建新产品
			const nId = generateId(40)
			newSize.productId = nId

			await convexHttp.mutation(api.products.create, {
				id: nId,
				name: entryProductName,
				slug: entryProductName.toLowerCase().replace(/\s+/g, '-'),
				desc: '',
				priceCents: entry.Amount * 100,
				images: [],
				tags: [],
				sizes: [newSize],
				gradientColorStart: '#000000',
				gradientColorVia: '#666666',
				gradientColorStop: '#999999',
				isActive: false
			})

			createdProducts.push({
				name: entryProductName,
				id: nId
			})
		}
	}

	return json({ success: true })
}
