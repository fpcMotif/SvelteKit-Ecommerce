import { v } from 'convex/values'
import { action } from './_generated/server'

export const startCheckout = action({
	args: {
		items: v.array(
			v.object({
				productSizeCode: v.string(),
				quantity: v.number()
			})
		)
	},
	returns: v.object({
		ok: v.boolean(),
		reason: v.optional(v.string()),
		sessionUrl: v.optional(v.string())
	}),
	handler: async () => {
		return {
			ok: false,
			reason: 'Stripe integration not yet enabled. Payment functionality will be integrated soon.'
		}
	}
})
