import * as Effect from 'effect/Effect'
import { query } from '$lib/effect/convex'
import { runPromiseLayer } from '$lib/effect/runtime'
import { api } from '../../../convex/_generated/api'

export const load = async ({ url }) => {
	const params = url.searchParams
	const allTags = params.getAll('tag')

	const collectionName = allTags.length == 0 ? 'All Products' : allTags[0]
	let collectionTagline = 'Everything we have to offer.'
	switch (collectionName) {
		case 'Sediment Collection':
			collectionTagline = 'Elegance. Frozen in glass.'
			break
		case 'Honor Collection':
			collectionTagline = 'Crystallize your history.'
	}

	const program = Effect.gen(function* () {
		const products = yield* query(api.products.list, {
			activeOnly: true,
			tags: allTags.length > 0 ? allTags : undefined,
			limit: 6,
			offset: 0
		})

		return {
			products,
			collectionInfo: {
				name: collectionName,
				tagline: collectionTagline
			}
		}
	})

	return await runPromiseLayer(program)
}
