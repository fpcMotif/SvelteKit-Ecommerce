import type { RequestEvent } from '@sveltejs/kit'
import { redirect } from '@sveltejs/kit'

export async function GET(event: RequestEvent): Promise<Response> {
	// Convex Auth handles the OAuth flow and sets the JWT cookie
	// Just redirect to home page
	const token = event.url.searchParams.get('token')

	if (token) {
		// Set the Convex Auth JWT cookie
		event.cookies.set('__convexAuthJWT', token, {
			path: '/',
			httpOnly: true,
			secure: import.meta.env.PROD,
			sameSite: 'lax',
			maxAge: 60 * 60 * 24 * 30 // 30 days
		})
	}

	return redirect(302, '/')
}
