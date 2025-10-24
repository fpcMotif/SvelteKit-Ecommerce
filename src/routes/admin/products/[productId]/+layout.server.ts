import { error } from '@sveltejs/kit'
import { ensureAdmin } from '$lib/server/auth'
import { convexHttp } from '$lib/server/convex'
import { api } from '../../../../../convex/_generated/api'

export const load = async ({ locals, params, url }) => {
	ensureAdmin(locals)

	const product = await convexHttp.query(api.products.getById, { id: params.productId })

	if (!product) {
		error(404)
	}

	return {
		productId: params.productId,
		productBasics: {
			name: product.name,
			desc: product.desc
		},
		url: url.pathname
	}
}
