import { ensureAdmin } from '$lib/server/auth'
import { fetchAllProducts } from '$lib/server/data/products'

export const load = async ({ locals }) => {
	ensureAdmin(locals)

	const products = await fetchAllProducts(100, 0)

	return { products }
}
