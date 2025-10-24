import { error, redirect } from '@sveltejs/kit'
import { generateId } from 'lucia'
import { zfd } from 'zod-form-data'
import { ensureAdmin } from '$lib/server/auth'
import { convexHttp } from '$lib/server/convex'
import { api } from '../../../../../convex/_generated/api'

export const actions = {
	default: async ({ locals, request }) => {
		ensureAdmin(locals)

		const data = await request.formData()

		const schema = zfd.formData({
			name: zfd.text(),
			desc: zfd.text()
		})

		const res = schema.safeParse(data)

		if (!res.success) {
			error(400, res.error.name)
		}

		const productId = generateId(15)
		const slug = res.data.name.toLowerCase().replace(/\s+/g, '-')

		await convexHttp.mutation(api.products.create, {
			id: productId,
			name: res.data.name,
			slug,
			desc: res.data.desc,
			priceCents: 0,
			images: [],
			tags: [],
			sizes: [],
			gradientColorStart: '#000000',
			gradientColorVia: '#666666',
			gradientColorStop: '#999999',
			isActive: false
		})

		redirect(300, `/admin/products/${productId}/sizes`)
	}
}
