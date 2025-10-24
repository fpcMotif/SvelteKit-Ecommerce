import { error, type RequestEvent } from '@sveltejs/kit'
import type Stripe from 'stripe'
import { zfd } from 'zod-form-data'
import { ensureAdmin } from '$lib/server/auth'
import { convexHttp } from '$lib/server/convex'
import { stripe } from '$lib/server/stripe'
import { api } from '../../../../convex/_generated/api'

type OrderDetails = {
	timestamp: Date
	stripeCustomerId: string | null
	stripeOrderId: string
	totalPrice: number
	status: 'new' | 'placed' | 'packaged' | 'sent'
	customerInfo: Stripe.Checkout.Session.CustomerDetails
	email: string
	products: {
		id: string
		productSizeCode: string
		quantity: number
	}[]
}

export const load = async ({ locals }: RequestEvent) => {
	ensureAdmin(locals)

	// 获取所有订单
	const orders = await convexHttp.query(api.orders.list, {})

	const sendOrders: OrderDetails[] = []

	// 为每个订单获取详细信息
	for (const order of orders) {
		if (!order.stripeOrderId) continue

		// 从 Stripe 获取会话详情
		const session = await stripe.checkout.sessions.retrieve(order.stripeOrderId)

		if (session.customer_details) {
			sendOrders.push({
				stripeCustomerId: order.stripeCustomerId ?? null,
				stripeOrderId: order.stripeOrderId,
				timestamp: new Date(order.createdAt),
				totalPrice: order.totalPrice,
				customerInfo: session.customer_details,
				status: order.status as 'new' | 'placed' | 'packaged' | 'sent',
				email: session.customer_details.email ?? '',
				products: order.items.map((item) => ({
					id: item.productId,
					productSizeCode: item.productSizeCode,
					quantity: item.quantity
				}))
			})
		}
	}

	return { orders: sendOrders }
}

// yea GPT gave me this one lol, never seen "status is" before
function isOrderStatus(status: string): status is 'new' | 'placed' | 'packaged' | 'sent' {
	return ['new', 'placed', 'packaged', 'sent'].includes(status)
}

export const actions = {
	setStatus: async ({ locals, request }: RequestEvent) => {
		ensureAdmin(locals)

		const data = await request.formData()

		const schema = zfd.formData({
			stripeOrderId: zfd.text(),
			status: zfd.text()
		})

		const res = schema.safeParse(data)

		if (!res.success) {
			error(400, res.error.name)
		}

		if (!isOrderStatus(res.data.status)) {
			error(400, 'invalid status')
		}

		// 通过 stripeOrderId 查找订单
		const order = await convexHttp.query(api.orders.getByStripeOrderId, {
			stripeOrderId: res.data.stripeOrderId
		})

		if (!order) {
			error(404, 'Order not found')
		}

		// 更新订单状态
		await convexHttp.mutation(api.orders.update, {
			id: order._id,
			patch: {
				status: res.data.status
			}
		})

		return { success: true }
	}
}
