import type { RequestEvent } from '@sveltejs/kit'
import { redirect } from '@sveltejs/kit'
import { PUBLIC_CONVEX_URL } from '$env/static/public'

export async function GET(event: RequestEvent): Promise<Response> {
	// Redirect to Convex Auth GitHub endpoint
	const callbackUrl = `${event.url.origin}/auth/callback/github`
	const authUrl = `${PUBLIC_CONVEX_URL}/auth/signin/github?redirectTo=${encodeURIComponent(callbackUrl)}`

	return redirect(302, authUrl)
}
