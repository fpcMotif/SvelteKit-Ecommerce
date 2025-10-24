import { convexHttp } from '$lib/server/convex'
// @ts-ignore - Convex generates .d.ts files which TypeScript struggles to resolve
import { api } from '../../../../convex/_generated/api'

export const deleteOneProduct = async (id: string) => {
	return await convexHttp.mutation(api.products.remove, { id })
}

export const fetchOneProduct = async (id: string) => {
	return await convexHttp.query(api.products.getById, { id })
}

export const fetchAllProducts = async (take?: number, skip?: number) => {
	return await convexHttp.query(api.products.list, {
		activeOnly: false,
		limit: take,
		offset: skip
	})
}
