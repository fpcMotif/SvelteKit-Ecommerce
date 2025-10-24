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

	return { tags: product.tags }
}

export const actions = {
	add: async ({ locals, request, params }) => {
		ensureAdmin(locals)

		const data = await request.formData()

		const schema = zfd.formData({
			tag: zfd.text()
		})

		const res = schema.safeParse(data)

		if (!res.success) {
			error(400, res.error.name)
		}

		const product = await convexHttp.query(api.products.getById, { id: params.productId })

		if (!product) {
			error(404)
		}

		const trimmedTag = res.data.tag.trim()

		if (!trimmedTag) {
			error(400, 'Tag cannot be empty')
		}

		if (product.tags.includes(trimmedTag)) {
			return { success: true }
		}

		const updatedTags = [...product.tags, trimmedTag]

		await convexHttp.mutation(api.products.update, {
			id: params.productId,
			patch: { tags: updatedTags }
		})

		return { success: true }
	},

	remove: async ({ locals, request, params }) => {
		ensureAdmin(locals)

		const data = await request.formData()

		const schema = zfd.formData({
			tag: zfd.text()
		})

		const res = schema.safeParse(data)

		if (!res.success) {
			error(400, res.error.name)
		}

		const product = await convexHttp.query(api.products.getById, { id: params.productId })

		if (!product) {
			error(404)
		}

		const updatedTags = product.tags.filter((t) => t !== res.data.tag)

		await convexHttp.mutation(api.products.update, {
			id: params.productId,
			patch: { tags: updatedTags }
		})

		return { success: true }
	}
}
