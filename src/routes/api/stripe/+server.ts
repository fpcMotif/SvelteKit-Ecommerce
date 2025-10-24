import { json } from '@sveltejs/kit'
import { Data, Effect } from 'effect'
import type { Stripe } from 'stripe'
import { env } from '$env/dynamic/private'
import { convexHttp } from '$lib/server/convex'
import { createNewOrder } from '$lib/server/data/orders'
import { sendThankYouPurchaseEmail } from '$lib/server/resend.js'
import { stripe } from '$lib/server/stripe'
import { api } from '../../../../convex/_generated/api'
import type { Doc } from '../../../../convex/_generated/dataModel'
import type { RequestHandler } from './$types'

class WebhookError extends Data.TaggedError('WebhookError')<{
	message: string
}> {}

class ConfigError extends Data.TaggedError('ConfigError')<{
	message: string
}> {}

function toBuffer(ab: ArrayBuffer): Buffer {
	const buf = Buffer.alloc(ab.byteLength)
	const view = new Uint8Array(ab)
	for (let i = 0; i < buf.length; i++) {
		buf[i] = view[i]
	}
	return buf
}

const handleWebhook = (
	request: Request,
	endpointSecret: string
): Effect.Effect<void, WebhookError, never> =>
	Effect.gen(function* () {
		const rawBody: ArrayBuffer = yield* Effect.tryPromise({
			try: () => request.arrayBuffer(),
			catch: (error) => new WebhookError({ message: `Failed to read request body: ${error}` })
		})

		const payload = toBuffer(rawBody)
		const signature = request.headers.get('stripe-signature') ?? ''

		const event: Stripe.Event = yield* Effect.try({
			try: () => stripe.webhooks.constructEvent(payload, signature, endpointSecret),
			catch: (error) =>
				new WebhookError({ message: `Webhook signature verification failed: ${error}` })
		})

		if (event.type !== 'checkout.session.completed') {
			return
		}

		const sessionWithCustomer: Stripe.Checkout.Session = yield* Effect.tryPromise({
			try: () =>
				stripe.checkout.sessions.retrieve(event.data.object.id, {
					expand: ['customer']
				}),
			catch: (error) => new WebhookError({ message: `Failed to retrieve session: ${error}` })
		})

		const metadata = sessionWithCustomer.metadata
		if (!metadata) {
			return
		}

		const codes: Array<{ quantity: number; code: string }> = yield* Effect.try({
			try: () => JSON.parse(metadata.codes) as Array<{ quantity: number; code: string }>,
			catch: (error) => new WebhookError({ message: `Invalid metadata.codes JSON: ${error}` })
		})

		const customer = sessionWithCustomer.customer as Stripe.Customer | null

		if (customer) {
			const userId = metadata.userId
			if (userId && userId !== '') {
				// Find user and update Stripe Customer ID
				const existingUser: Doc<'users'> | null = yield* Effect.tryPromise({
					try: () => convexHttp.query(api.users.getByExternalId, { externalId: userId }),
					catch: (error) => new WebhookError({ message: `Failed to query user: ${error}` })
				})

				if (existingUser) {
					yield* Effect.tryPromise({
						try: () =>
							convexHttp.mutation(api.users.update, {
								id: existingUser._id,
								patch: { stripeCustomerId: customer.id }
							}),
						catch: (error) => new WebhookError({ message: `Failed to update user: ${error}` })
					})
				}
			}
		}

		// Prepare order items
		const items = codes.map((code) => ({
			productId: '', // Need to retrieve product ID from product size code
			productSizeCode: code.code,
			quantity: code.quantity,
			priceCents: 0 // Need to calculate from Stripe session
		}))

		// Create order
		yield* Effect.tryPromise({
			try: () =>
				createNewOrder({
					userId: metadata.userId ?? '',
					orderId: sessionWithCustomer.id,
					customerId: customer?.id ?? null,
					totalPrice: sessionWithCustomer.amount_total ?? 0,
					items
				}),
			catch: (error) => new WebhookError({ message: `Failed to create order: ${error}` })
		})

		const email = sessionWithCustomer.customer_details?.email
		if (email) {
			yield* Effect.tryPromise({
				try: () => sendThankYouPurchaseEmail(email),
				catch: (error) => new WebhookError({ message: `Failed to send email: ${error}` })
			})
		}
	})

export const POST: RequestHandler = async ({ request }) => {
	const endpointSecret = env.STRIPE_WEBHOOK_SECRET

	const program: Effect.Effect<void, WebhookError | ConfigError> = Effect.gen(function* () {
		if (!endpointSecret) {
			return yield* Effect.fail(
				new ConfigError({ message: 'STRIPE_WEBHOOK_SECRET environment variable not configured' })
			)
		}

		yield* handleWebhook(request, endpointSecret)
	})

	const result = await Effect.runPromise(Effect.either(program))

	if (result._tag === 'Left') {
		return json({ success: false, error: result.left.message }, { status: 500 })
	}

	return json({ success: true })
}
