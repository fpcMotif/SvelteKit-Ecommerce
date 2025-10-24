import { error } from '@sveltejs/kit'
import * as Effect from 'effect/Effect'
import { query } from '$lib/effect/convex'
import { runPromise } from '$lib/effect/runtime'
import { api } from '../../../../convex/_generated/api'

export const load = async ({ params }) => {
	const program = Effect.gen(function* () {
		const product = yield* query(api.products.getById, { id: params.productId })

		if (!product) {
			error(404, {
				message: 'Not found'
			})
		}

		const primaryImage = product.images.find((img) => img.isPrimary) || product.images[0] || null

		return {
			product,
			primaryImage
		}
	})

	return await runPromise(program)
}
