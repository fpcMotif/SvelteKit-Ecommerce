import { v } from 'convex/values'
import { mutation, query } from './_generated/server'

const userValidator = v.object({
	_id: v.id('users'),
	_creationTime: v.number(),
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

export const getByExternalId = query({
	args: { externalId: v.string() },
	returns: v.union(userValidator, v.null()),
	handler: async (ctx, { externalId }) => {
		return await ctx.db
			.query('users')
			.withIndex('by_external', (q) => q.eq('externalId', externalId))
			.unique()
	}
})

export const getByEmail = query({
	args: { email: v.string() },
	returns: v.union(userValidator, v.null()),
	handler: async (ctx, { email }) => {
		return await ctx.db
			.query('users')
			.withIndex('by_email', (q) => q.eq('email', email))
			.unique()
	}
})

export const getByProvider = query({
	args: {
		provider: v.union(v.literal('google'), v.literal('github'), v.literal('dev')),
		providerId: v.string()
	},
	returns: v.union(userValidator, v.null()),
	handler: async (ctx, { provider, providerId }) => {
		return await ctx.db
			.query('users')
			.withIndex('by_provider', (q) => q.eq('provider', provider).eq('providerId', providerId))
			.unique()
	}
})

export const create = mutation({
	args: {
		id: v.optional(v.string()),
		externalId: v.optional(v.string()),
		provider: v.optional(v.union(v.literal('google'), v.literal('github'), v.literal('dev'))),
		providerId: v.optional(v.string()),
		email: v.string(),
		firstName: v.optional(v.string()),
		lastName: v.optional(v.string()),
		isAdmin: v.optional(v.boolean()),
		stripeCustomerId: v.optional(v.string())
	},
	returns: v.id('users'),
	handler: async (ctx, args) => {
		return await ctx.db.insert('users', {
			...args,
			isAdmin: args.isAdmin || false
		})
	}
})

export const update = mutation({
	args: {
		id: v.id('users'),
		patch: v.object({
			email: v.optional(v.string()),
			firstName: v.optional(v.string()),
			lastName: v.optional(v.string()),
			isAdmin: v.optional(v.boolean()),
			stripeCustomerId: v.optional(v.string())
		})
	},
	returns: v.id('users'),
	handler: async (ctx, { id, patch }) => {
		const user = await ctx.db.get(id)
		if (!user) throw new Error('User not found')
		await ctx.db.patch(id, patch)
		return id
	}
})

export const upsertByExternalId = mutation({
	args: {
		externalId: v.string(),
		email: v.string(),
		firstName: v.optional(v.string()),
		lastName: v.optional(v.string()),
		isAdmin: v.optional(v.boolean()),
		stripeCustomerId: v.optional(v.string())
	},
	returns: v.id('users'),
	handler: async (ctx, args) => {
		const existing = await ctx.db
			.query('users')
			.withIndex('by_external', (q) => q.eq('externalId', args.externalId))
			.unique()

		if (existing) {
			await ctx.db.patch(existing._id, {
				email: args.email,
				firstName: args.firstName,
				lastName: args.lastName,
				isAdmin: args.isAdmin !== undefined ? args.isAdmin : existing.isAdmin,
				stripeCustomerId: args.stripeCustomerId
			})
			return existing._id
		}

		return await ctx.db.insert('users', {
			...args,
			isAdmin: args.isAdmin || false
		})
	}
})
