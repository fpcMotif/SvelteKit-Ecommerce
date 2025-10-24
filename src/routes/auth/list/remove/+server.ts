import { error, redirect } from '@sveltejs/kit'
import { convexHttp } from '$lib/server/convex'
import { api } from '../../../../../convex/_generated/api'

export const GET = async ({ url }) => {
	const key = url.searchParams.get('key')
	const email = url.searchParams.get('email')

	if (!key || !email) {
		error(400, 'missing key and/or email...')
	}

	await convexHttp.mutation(api.emailList.unsubscribe, {
		email
	})

	return redirect(303, '/status/list/removed')
}
