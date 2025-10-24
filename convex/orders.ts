import { v } from 'convex/values'
import { mutation, query } from './_generated/server'

export const list = query({
	args: {
		userId: v.optional(v.string()),
		status: v.optional(v.string()),
		limit: v.optional(v.number())
	},
	returns: v.array(
		v.object({
			_id: v.id('orders'),
			_creationTime: v.number(),
			userId: v.string(),
			stripeOrderId: v.optional(v.string()),
			stripeCustomerId: v.optional(v.string()),
			items: v.array(
				v.object({
					productId: v.id('products'),
					productSizeCode: v.string(),
					quantity: v.number(),
					priceCents: v.number()
				})
			),
			totalPrice: v.number(),
			status: v.union(
				v.literal('new'),
				v.literal('placed'),
				v.literal('packaged'),
				v.literal('sent'),
				v.literal('pending'),
				v.literal('paid'),
				v.literal('failed'),
				v.literal('cancelled')
			),
			note: v.optional(v.string()),
			createdAt: v.number(),
			updatedAt: v.number()
		})
	),
	handler: async (ctx, { userId, status, limit }) => {
		const results = await (userId
			? ctx.db
					.query('orders')
					.withIndex('by_user', (q) => q.eq('userId', userId))
					.order('desc')
					.collect()
			: ctx.db.query('orders').order('desc').collect())

		let filtered = results
		if (status) {
			filtered = results.filter((order) => order.status === status)
		}

		return limit ? filtered.slice(0, limit) : filtered
	}
})

export const getById = query({
	args: { id: v.id('orders') },
	returns: v.union(
		v.object({
			_id: v.id('orders'),
			_creationTime: v.number(),
			userId: v.string(),
			stripeOrderId: v.optional(v.string()),
			stripeCustomerId: v.optional(v.string()),
			items: v.array(
				v.object({
					productId: v.id('products'),
					productSizeCode: v.string(),
					quantity: v.number(),
					priceCents: v.number()
				})
			),
			totalPrice: v.number(),
			status: v.union(
				v.literal('new'),
				v.literal('placed'),
				v.literal('packaged'),
				v.literal('sent'),
				v.literal('pending'),
				v.literal('paid'),
				v.literal('failed'),
				v.literal('cancelled')
			),
			note: v.optional(v.string()),
			createdAt: v.number(),
			updatedAt: v.number()
		}),
		v.null()
	),
	handler: async (ctx, { id }) => {
		return await ctx.db.get(id)
	}
})

export const getByStripeOrderId = query({
	args: { stripeOrderId: v.string() },
	returns: v.union(
		v.object({
			_id: v.id('orders'),
			_creationTime: v.number(),
			userId: v.string(),
			stripeOrderId: v.optional(v.string()),
			stripeCustomerId: v.optional(v.string()),
			items: v.array(
				v.object({
					productId: v.id('products'),
					productSizeCode: v.string(),
					quantity: v.number(),
					priceCents: v.number()
				})
			),
			totalPrice: v.number(),
			status: v.union(
				v.literal('new'),
				v.literal('placed'),
				v.literal('packaged'),
				v.literal('sent'),
				v.literal('pending'),
				v.literal('paid'),
				v.literal('failed'),
				v.literal('cancelled')
			),
			note: v.optional(v.string()),
			createdAt: v.number(),
			updatedAt: v.number()
		}),
		v.null()
	),
	handler: async (ctx, { stripeOrderId }) => {
		return await ctx.db
			.query('orders')
			.withIndex('by_stripe_order', (q) => q.eq('stripeOrderId', stripeOrderId))
			.unique()
	}
})

export const create = mutation({
	args: {
		userId: v.string(),
		stripeOrderId: v.optional(v.string()),
		stripeCustomerId: v.optional(v.string()),
		items: v.array(
			v.object({
				productId: v.id('products'),
				productSizeCode: v.string(),
				quantity: v.number(),
				priceCents: v.number()
			})
		),
		totalPrice: v.number(),
		status: v.optional(v.string()),
		note: v.optional(v.string())
	},
	returns: v.id('orders'),
	handler: async (ctx, args) => {
		const now = Date.now()
		return await ctx.db.insert('orders', {
			...args,
			status: (args.status as any) || 'pending',
			createdAt: now,
			updatedAt: now
		})
	}
})

export const updateStatus = mutation({
	args: {
		id: v.id('orders'),
		status: v.string()
	},
	returns: v.id('orders'),
	handler: async (ctx, { id, status }) => {
		const order = await ctx.db.get(id)
		if (!order) throw new Error('Order not found')
		await ctx.db.patch(id, { status: status as any, updatedAt: Date.now() })
		return id
	}
})

export const update = mutation({
	args: {
		id: v.id('orders'),
		patch: v.object({
			status: v.optional(v.string()),
			note: v.optional(v.string()),
			stripeOrderId: v.optional(v.string()),
			stripeCustomerId: v.optional(v.string())
		})
	},
	returns: v.id('orders'),
	handler: async (ctx, { id, patch }) => {
		const order = await ctx.db.get(id)
		if (!order) throw new Error('Order not found')
		await ctx.db.patch(id, { ...patch, updatedAt: Date.now() } as any)
		return id
	}
})
