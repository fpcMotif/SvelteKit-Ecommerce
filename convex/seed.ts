import { v } from 'convex/values'
import { internalMutation } from './_generated/server'

export const seedProducts = internalMutation({
	args: {},
	returns: v.null(),
	handler: async (ctx) => {
		const existingProducts = await ctx.db.query('products').collect()
		if (existingProducts.length > 0) {
			console.log('Products already exist, skipping seed')
			return null
		}

		const now = Date.now()

		const product1 = await ctx.db.insert('products', {
			id: 'premium-canvas-print',
			name: 'Premium Canvas Print',
			slug: 'premium-canvas-print',
			desc: 'High-quality canvas print with vivid colors and exceptional detail.',
			priceCents: 4999,
			images: [
				{
					cloudinaryId: 'sample-product-1',
					width: 1000,
					height: 1000,
					isPrimary: true,
					isVertical: false,
					order: 0
				},
				{
					cloudinaryId: 'sample-product-1-alt',
					width: 1000,
					height: 1000,
					isPrimary: false,
					isVertical: false,
					order: 1
				}
			],
			tags: ['Sediment Collection', 'Canvas'],
			sizes: [
				{
					code: 'small',
					name: 'Small (8x10)',
					isAvailable: true,
					width: 8,
					height: 10,
					price: 2999,
					stripePriceId: 'price_small',
					stripeProductId: 'prod_small',
					productId: 'premium-canvas-print'
				},
				{
					code: 'medium',
					name: 'Medium (16x20)',
					isAvailable: true,
					width: 16,
					height: 20,
					price: 4999,
					stripePriceId: 'price_medium',
					stripeProductId: 'prod_medium',
					productId: 'premium-canvas-print'
				},
				{
					code: 'large',
					name: 'Large (24x36)',
					isAvailable: true,
					width: 24,
					height: 36,
					price: 7999,
					stripePriceId: 'price_large',
					stripeProductId: 'prod_large',
					productId: 'premium-canvas-print'
				}
			],
			gradientColorStart: 'from-blue-600',
			gradientColorVia: 'via-purple-500',
			gradientColorStop: 'to-pink-400',
			isActive: true,
			createdAt: now,
			updatedAt: now
		})

		const product2 = await ctx.db.insert('products', {
			id: 'honor-collection-frame',
			name: 'Honor Collection Frame',
			slug: 'honor-collection-frame',
			desc: 'Elegant frame perfect for commemorating special moments. Crystallize your history.',
			priceCents: 6999,
			images: [
				{
					cloudinaryId: 'sample-product-2',
					width: 1000,
					height: 1000,
					isPrimary: true,
					isVertical: false,
					order: 0
				},
				{
					cloudinaryId: 'sample-product-2-alt',
					width: 1000,
					height: 1000,
					isPrimary: false,
					isVertical: false,
					order: 1
				}
			],
			tags: ['Honor Collection', 'Frame'],
			sizes: [
				{
					code: 'standard',
					name: 'Standard (12x16)',
					isAvailable: true,
					width: 12,
					height: 16,
					price: 6999,
					stripePriceId: 'price_standard',
					stripeProductId: 'prod_standard',
					productId: 'honor-collection-frame'
				},
				{
					code: 'premium',
					name: 'Premium (20x30)',
					isAvailable: true,
					width: 20,
					height: 30,
					price: 12999,
					stripePriceId: 'price_premium',
					stripeProductId: 'prod_premium',
					productId: 'honor-collection-frame'
				}
			],
			gradientColorStart: 'from-red-600',
			gradientColorVia: 'via-orange-500',
			gradientColorStop: 'to-yellow-400',
			isActive: true,
			createdAt: now,
			updatedAt: now
		})

		console.log('Seeded products:', { product1, product2 })
		return null
	}
})

export const seedUsers = internalMutation({
	args: {},
	returns: v.null(),
	handler: async (ctx) => {
		const existingUsers = await ctx.db.query('users').collect()
		if (existingUsers.length > 0) {
			console.log('Users already exist, skipping seed')
			return null
		}

		const testUser = await ctx.db.insert('users', {
			externalId: 'test-user-123',
			email: 'test@example.com',
			firstName: 'Test',
			lastName: 'User',
			isAdmin: true
		})

		console.log('Seeded user:', testUser)
		return null
	}
})
