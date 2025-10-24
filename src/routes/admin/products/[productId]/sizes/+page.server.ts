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

	return { sizes: product.sizes }
}

export const actions = {
	delete: async ({ locals, request, params }) => {
		ensureAdmin(locals)

		const data = await request.formData()

		const schema = zfd.formData({
			code: zfd.text()
		})

		const res = schema.safeParse(data)

		if (!res.success) {
			error(400, res.error.name)
		}

		const product = await convexHttp.query(api.products.getById, { id: params.productId })

		if (!product) {
			error(404)
		}

		const updatedSizes = product.sizes.filter((size) => size.code !== res.data.code)

		await convexHttp.mutation(api.products.update, {
			id: params.productId,
			patch: { sizes: updatedSizes }
		})

		return { success: true }
	},

	edit: async ({ locals, request, params }) => {
		ensureAdmin(locals)

		const data = await request.formData()

		const schema = zfd.formData({
			code: zfd.text(),
			name: zfd.text(),
			width: zfd.numeric(),
			height: zfd.numeric(),
			price: zfd.numeric(),
			stripePriceId: zfd.text(),
			stripeProductId: zfd.text(),
			isAvailable: zfd.checkbox()
		})

		const res = schema.safeParse(data)

		if (!res.success) {
			error(400, res.error.name)
		}

		const product = await convexHttp.query(api.products.getById, { id: params.productId })

		if (!product) {
			error(404)
		}

		const updatedSizes = product.sizes.map((size) =>
			size.code === res.data.code
				? {
						...size,
						name: res.data.name,
						width: res.data.width,
						height: res.data.height,
						price: res.data.price,
						stripePriceId: res.data.stripePriceId,
						stripeProductId: res.data.stripeProductId,
						isAvailable: res.data.isAvailable
					}
				: size
		)

		await convexHttp.mutation(api.products.update, {
			id: params.productId,
			patch: { sizes: updatedSizes }
		})

		return { success: true }
	},
	create: async ({ locals, request, params }) => {
		ensureAdmin(locals)

		const data = await request.formData()

		const schema = zfd.formData({
			code: zfd.text(),
			name: zfd.text(),
			width: zfd.numeric(),
			height: zfd.numeric(),
			price: zfd.numeric(),
			stripePriceId: zfd.text(),
			stripeProductId: zfd.text(),
			isAvailable: zfd.checkbox()
		})

		const res = schema.safeParse(data)

		if (!res.success) {
			error(400, res.error.name)
		}

		const product = await convexHttp.query(api.products.getById, { id: params.productId })

		if (!product) {
			error(404)
		}

		const newSize = {
			code: res.data.code,
			name: res.data.name,
			width: res.data.width,
			height: res.data.height,
			price: res.data.price,
			stripePriceId: res.data.stripePriceId,
			stripeProductId: res.data.stripeProductId,
			isAvailable: res.data.isAvailable,
			productId: params.productId
		}

		const updatedSizes = [...product.sizes, newSize]

		await convexHttp.mutation(api.products.update, {
			id: params.productId,
			patch: { sizes: updatedSizes }
		})

		return { success: true }
	}
}
