import { authTables } from '@convex-dev/auth/server'
import { defineSchema, defineTable } from 'convex/server'
import { v } from 'convex/values'

export default defineSchema({
	...authTables,
	products: defineTable({
		id: v.string(),
		name: v.string(),
		slug: v.string(),
		desc: v.string(),
		priceCents: v.number(),
		images: v.array(
			v.object({
				cloudinaryId: v.string(),
				width: v.number(),
				height: v.number(),
				isPrimary: v.boolean(),
				isVertical: v.boolean(),
				order: v.number()
			})
		),
		tags: v.array(v.string()),
		sizes: v.array(
			v.object({
				code: v.string(),
				name: v.string(),
				isAvailable: v.boolean(),
				width: v.number(),
				height: v.number(),
				price: v.number(),
				stripePriceId: v.string(),
				stripeProductId: v.string(),
				productId: v.string()
			})
		),
		gradientColorStart: v.string(),
		gradientColorVia: v.string(),
		gradientColorStop: v.string(),
		isActive: v.boolean(),
		createdAt: v.number(),
		updatedAt: v.number()
	})
		.index('by_slug', ['slug'])
		.index('by_active', ['isActive'])
		.index('by_product_id', ['id']),

	orders: defineTable({
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
		.index('by_user', ['userId'])
		.index('by_status', ['status'])
		.index('by_stripe_order', ['stripeOrderId']),

	users: defineTable({
		id: v.optional(v.string()),
		externalId: v.optional(v.string()),
		provider: v.optional(v.union(v.literal('google'), v.literal('github'), v.literal('dev'))),
		providerId: v.optional(v.string()),
		email: v.string(),
		firstName: v.optional(v.string()),
		lastName: v.optional(v.string()),
		isAdmin: v.boolean(),
		stripeCustomerId: v.optional(v.string())
	})
		.index('by_external', ['externalId'])
		.index('by_email', ['email'])
		.index('by_provider', ['provider', 'providerId']),

	emailList: defineTable({
		email: v.string(),
		subscribedAt: v.number(),
		unsubscribedAt: v.optional(v.number()),
		key: v.string()
	}).index('by_email', ['email']),

	productReviews: defineTable({
		productId: v.id('products'),
		rating: v.number(),
		reviewText: v.optional(v.string()),
		userId: v.optional(v.string()),
		timestamp: v.number()
	}).index('by_product', ['productId'])
})
