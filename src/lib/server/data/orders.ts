import { api } from '../../../convex/_generated/api'
import { convexHttp } from '../convex'

export const fetchAllOrders = async (take?: number, skip?: number) => {
	const orders = await convexHttp.query(api.orders.list, {
		limit: take ?? 10
	})

	// Skip orders if needed (Convex doesn't have built-in skip, so we slice)
	if (skip) {
		return orders.slice(skip)
	}

	return orders
}

export const createNewOrder = async (data: {
	userId: string
	orderId: string
	customerId: string | null
	totalPrice: number
	items: Array<{
		productId: string
		productSizeCode: string
		quantity: number
		priceCents: number
	}>
}) => {
	const convexOrderId = await convexHttp.mutation(api.orders.create, {
		userId: data.userId,
		stripeOrderId: data.orderId,
		stripeCustomerId: data.customerId ?? undefined,
		totalPrice: data.totalPrice,
		items: data.items as any,
		status: 'placed'
	})

	return convexOrderId
}
