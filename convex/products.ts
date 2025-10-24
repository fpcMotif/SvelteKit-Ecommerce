import { v } from 'convex/values'
import { mutation, query } from './_generated/server'

const productValidator = v.object({
	_id: v.id('products'),
	_creationTime: v.number(),
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

export const list = query({
	args: {
		activeOnly: v.optional(v.boolean()),
		tags: v.optional(v.array(v.string())),
		limit: v.optional(v.number()),
		offset: v.optional(v.number())
	},
	returns: v.array(productValidator),
	handler: async (ctx, { activeOnly = true, tags, limit, offset = 0 }) => {
		const results = await (activeOnly
			? ctx.db
					.query('products')
					.withIndex('by_active', (q) => q.eq('isActive', true))
					.collect()
			: ctx.db.query('products').collect())

		let filtered = results
		if (tags && tags.length > 0) {
			filtered = results.filter((product) => tags.some((tag) => product.tags.includes(tag)))
		}

		const sliced = limit ? filtered.slice(offset, offset + limit) : filtered.slice(offset)

		return sliced
	}
})

export const getById = query({
	args: { id: v.string() },
	returns: v.union(productValidator, v.null()),
	handler: async (ctx, { id }) => {
		return await ctx.db
			.query('products')
			.withIndex('by_product_id', (q) => q.eq('id', id))
			.unique()
	}
})

export const getBySlug = query({
	args: { slug: v.string() },
	returns: v.union(productValidator, v.null()),
	handler: async (ctx, { slug }) => {
		const product = await ctx.db
			.query('products')
			.withIndex('by_slug', (q) => q.eq('slug', slug))
			.unique()
		return product
	}
})

export const create = mutation({
	args: {
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
		isActive: v.boolean()
	},
	returns: v.id('products'),
	handler: async (ctx, args) => {
		const now = Date.now()
		return await ctx.db.insert('products', {
			...args,
			createdAt: now,
			updatedAt: now
		})
	}
})

export const update = mutation({
	args: {
		id: v.string(),
		patch: v.object({
			name: v.optional(v.string()),
			slug: v.optional(v.string()),
			desc: v.optional(v.string()),
			priceCents: v.optional(v.number()),
			images: v.optional(
				v.array(
					v.object({
						cloudinaryId: v.string(),
						width: v.number(),
						height: v.number(),
						isPrimary: v.boolean(),
						isVertical: v.boolean(),
						order: v.number()
					})
				)
			),
			tags: v.optional(v.array(v.string())),
			sizes: v.optional(
				v.array(
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
				)
			),
			gradientColorStart: v.optional(v.string()),
			gradientColorVia: v.optional(v.string()),
			gradientColorStop: v.optional(v.string()),
			isActive: v.optional(v.boolean())
		})
	},
	returns: v.string(),
	handler: async (ctx, { id, patch }) => {
		const prod = await ctx.db
			.query('products')
			.withIndex('by_product_id', (q) => q.eq('id', id))
			.unique()
		if (!prod) throw new Error('Product not found')
		await ctx.db.patch(prod._id, { ...patch, updatedAt: Date.now() })
		return id
	}
})

export const remove = mutation({
	args: { id: v.string() },
	returns: v.string(),
	handler: async (ctx, { id }) => {
		const prod = await ctx.db
			.query('products')
			.withIndex('by_product_id', (q) => q.eq('id', id))
			.unique()
		if (!prod) throw new Error('Product not found')
		await ctx.db.delete(prod._id)
		return id
	}
})
