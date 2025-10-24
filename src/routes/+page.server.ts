import { convexHttp } from '$lib/server/convex'
import { api } from '../../convex/_generated/api'

type SendCollection = {
	name: string
	tagLine: string
	productInfo: {
		cloudinaryId: string | null
		secondaryCloudinary: string | null
		name: string
		availableSizes: string[]
		soldOutSizes: string[]
		link: string
	}[]
	dark: boolean
	collectionTag: string
}

export const load = async () => {
	// Get all active products
	const products = await convexHttp.query(api.products.list, { activeOnly: true })

	// Group products by tags
	const tagMap = new Map<string, typeof products>()

	products.forEach((product: (typeof products)[number]) => {
		product.tags.forEach((tag) => {
			if (!tagMap.has(tag)) {
				tagMap.set(tag, [])
			}
			tagMap.get(tag)?.push(product)
		})
	})

	// Transform to collection format
	const sendData: SendCollection[] = []

	tagMap.forEach((tagProducts, tagName) => {
		if (tagProducts.length > 0) {
			// Sort images - vertical images first
			const sortedProducts = tagProducts.map((p) => ({
				...p,
				images: [...p.images].sort((a, b) => Number(b.isVertical) - Number(a.isVertical))
			}))

			sendData.push({
				dark: true,
				collectionTag: tagName,
				name: tagName,
				tagLine: `Explore our ${tagName} collection`,
				productInfo: sortedProducts.map((p) => ({
					cloudinaryId: p.images.length > 0 ? p.images[0].cloudinaryId : null,
					secondaryCloudinary: p.images.length > 1 ? p.images[1].cloudinaryId : null,
					name: p.name,
					availableSizes: p.sizes.filter((s) => s.isAvailable).map((s) => `${s.width}x${s.height}`),
					soldOutSizes: p.sizes.filter((s) => !s.isAvailable).map((s) => `${s.width}x${s.height}`),
					link: `/products/${p.id}`
				}))
			})
		}
	})

	return { collections: sendData }
}
