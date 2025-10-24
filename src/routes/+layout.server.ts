import { convexHttp } from '$lib/server/convex'
import { api } from '../../convex/_generated/api'

export const load = async ({ locals }) => {
	// Get all orders
	const orders = await convexHttp.query(api.orders.list, {})

	// Get all products
	const allProducts = await convexHttp.query(api.products.list, { activeOnly: false })

	// Build collections from product tags
	const reducedCollections: {
		collection: string
		products: {
			name: string
			id: string
		}[]
	}[] = []

	allProducts.forEach((product) => {
		product.tags.forEach((tag) => {
			const collection = reducedCollections.find((col) => col.collection === tag)
			if (collection) {
				collection.products.push({ name: product.name, id: product.id })
			} else {
				reducedCollections.push({
					collection: tag,
					products: [{ name: product.name, id: product.id }]
				})
			}
		})
	})

	const pieces = allProducts.map((p) => ({
		id: p.id,
		name: p.name
	}))

	return {
		user: locals.user,
		collections: reducedCollections,
		isSoldOut: orders.length >= 10,
		numberLeft: 10 - orders.length,
		pieces
	}
}
