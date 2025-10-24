import { redirect } from '@sveltejs/kit'
import { isDevAuthEnabled } from '$lib/server/auth/env'
import { clearDevSession } from '$lib/server/auth/mock'

export const GET = async (event) => {
	if (isDevAuthEnabled()) {
		clearDevSession(event)
		return redirect(302, '/auth/login')
	}

	// Clear Convex Auth JWT cookie
	event.cookies.delete('__convexAuthJWT', {
		path: '/'
	})

	return redirect(302, '/auth/login')
}
