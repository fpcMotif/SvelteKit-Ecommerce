import { v } from 'convex/values'
import { mutation, query } from './_generated/server'

const emailListValidator = v.object({
	_id: v.id('emailList'),
	_creationTime: v.number(),
	email: v.string(),
	subscribedAt: v.number(),
	unsubscribedAt: v.optional(v.number()),
	key: v.string()
})

export const getByEmail = query({
	args: { email: v.string() },
	returns: v.union(emailListValidator, v.null()),
	handler: async (ctx, { email }) => {
		return await ctx.db
			.query('emailList')
			.withIndex('by_email', (q) => q.eq('email', email))
			.unique()
	}
})

export const subscribe = mutation({
	args: {
		email: v.string(),
		key: v.string()
	},
	returns: v.id('emailList'),
	handler: async (ctx, { email, key }) => {
		const existing = await ctx.db
			.query('emailList')
			.withIndex('by_email', (q) => q.eq('email', email))
			.unique()

		const now = Date.now()

		if (existing) {
			// If already exists but unsubscribed, reactivate
			if (existing.unsubscribedAt) {
				await ctx.db.patch(existing._id, {
					unsubscribedAt: undefined,
					subscribedAt: now,
					key
				})
			}
			return existing._id
		}

		return await ctx.db.insert('emailList', {
			email,
			key,
			subscribedAt: now
		})
	}
})

export const unsubscribe = mutation({
	args: { email: v.string() },
	returns: v.union(v.id('emailList'), v.null()),
	handler: async (ctx, { email }) => {
		const existing = await ctx.db
			.query('emailList')
			.withIndex('by_email', (q) => q.eq('email', email))
			.unique()

		if (!existing) {
			return null
		}

		await ctx.db.patch(existing._id, {
			unsubscribedAt: Date.now()
		})

		return existing._id
	}
})

export const list = query({
	args: {
		includeUnsubscribed: v.optional(v.boolean())
	},
	returns: v.array(emailListValidator),
	handler: async (ctx, { includeUnsubscribed = false }) => {
		const allEmails = await ctx.db.query('emailList').collect()

		if (includeUnsubscribed) {
			return allEmails
		}

		return allEmails.filter((email) => !email.unsubscribedAt)
	}
})
