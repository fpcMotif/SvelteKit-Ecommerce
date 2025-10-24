import { error } from '@sveltejs/kit'
import { zfd } from 'zod-form-data'
import { ensureAdmin } from '$lib/server/auth'
import { convexHttp } from '$lib/server/convex'
import { api } from '../../../../../../convex/_generated/api'

export const load = async ({ locals, params }) => {
	ensureAdmin(locals)

	const product = await convexHttp.query(api.products.getById, { id: params.productId })

	if (!product) {
		error(404)
	}

	// Sort images with primary first
	const images = [...product.images].sort((a, b) => Number(b.isPrimary) - Number(a.isPrimary))

	return { productId: params.productId, images }
}

export const actions = {
	toggleVertical: async ({ locals, request, params }) => {
		ensureAdmin(locals)

		const data = await request.formData()

		const schema = zfd.formData({
			cloudinaryId: zfd.text()
		})

		const res = schema.safeParse(data)

		if (!res.success) {
			error(400, res.error.name)
		}

		const product = await convexHttp.query(api.products.getById, { id: params.productId })

		if (!product) {
			error(404)
		}

		const updatedImages: Array<{
			cloudinaryId: string
			width: number
			height: number
			isPrimary: boolean
			isVertical: boolean
			order: number
		}> = product.images.map((img) =>
			img.cloudinaryId === res.data.cloudinaryId ? { ...img, isVertical: !img.isVertical } : img
		)

		await convexHttp.mutation(api.products.update, {
			id: params.productId,
			patch: { images: updatedImages }
		})

		return { success: true }
	},
	markPrimary: async ({ locals, request, params }) => {
		ensureAdmin(locals)

		const data = await request.formData()

		const schema = zfd.formData({
			cloudinaryId: zfd.text()
		})

		const res = schema.safeParse(data)

		if (!res.success) {
			error(400, res.error.name)
		}

		const product = await convexHttp.query(api.products.getById, { id: params.productId })

		if (!product) {
			error(404)
		}

		const updatedImages: Array<{
			cloudinaryId: string
			width: number
			height: number
			isPrimary: boolean
			isVertical: boolean
			order: number
		}> = product.images.map((img) => ({
			...img,
			isPrimary: img.cloudinaryId === res.data.cloudinaryId
		}))

		await convexHttp.mutation(api.products.update, {
			id: params.productId,
			patch: { images: updatedImages }
		})

		return { success: true }
	},
	delete: async ({ locals, request, params }) => {
		ensureAdmin(locals)

		const data = await request.formData()

		const schema = zfd.formData({
			cloudinaryId: zfd.text()
		})

		const res = schema.safeParse(data)

		if (!res.success) {
			error(400, res.error.name)
		}

		const product = await convexHttp.query(api.products.getById, { id: params.productId })

		if (!product) {
			error(404)
		}

		const updatedImages: Array<{
			cloudinaryId: string
			width: number
			height: number
			isPrimary: boolean
			isVertical: boolean
			order: number
		}> = product.images.filter((img) => img.cloudinaryId !== res.data.cloudinaryId)

		await convexHttp.mutation(api.products.update, {
			id: params.productId,
			patch: { images: updatedImages }
		})

		return { success: true }
	},
	create: async ({ locals, request, params }) => {
		ensureAdmin(locals)

		const data = await request.formData()

		const schema = zfd.formData({
			cloudinaryId: zfd.text(),
			width: zfd.numeric(),
			height: zfd.numeric()
		})

		const res = schema.safeParse(data)

		if (!res.success) {
			error(400, res.error.name)
		}

		const product = await convexHttp.query(api.products.getById, { id: params.productId })

		if (!product) {
			error(404)
		}

		const newImage = {
			cloudinaryId: res.data.cloudinaryId,
			width: res.data.width,
			height: res.data.height,
			isVertical: res.data.height > res.data.width,
			isPrimary: product.images.length === 0,
			order: product.images.length
		}

		const updatedImages = [...product.images, newImage]

		await convexHttp.mutation(api.products.update, {
			id: params.productId,
			patch: { images: updatedImages }
		})

		return { success: true }
	}
}
