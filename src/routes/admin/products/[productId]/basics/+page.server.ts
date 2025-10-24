import { error } from '@sveltejs/kit'
import { zfd } from 'zod-form-data'
import { ensureAdmin } from '$lib/server/auth'
import { convexHttp } from '$lib/server/convex'
import { api } from '../../../../../../convex/_generated/api'

export const actions = {
	default: async ({ locals, request, params }) => {
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

		await convexHttp.mutation(api.products.update, {
			id: params.productId,
			patch: {
				name: res.data.name,
				desc: res.data.desc,
				slug: res.data.name.toLowerCase().replace(/\s+/g, '-')
			}
		})

		return { success: true }
	}
}
