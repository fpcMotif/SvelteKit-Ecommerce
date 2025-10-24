import { json } from '@sveltejs/kit'
import { ensureAdmin } from '$lib/server/auth'
import { deleteOneProduct } from '$lib/server/data/products.js'

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
