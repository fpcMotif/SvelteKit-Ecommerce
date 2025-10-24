import type { RequestEvent } from '@sveltejs/kit'
import { redirect } from '@sveltejs/kit'
import { isDevAuthEnabled } from '$lib/server/auth/env'
import { issueDevSession } from '$lib/server/auth/mock'

export async function GET(event: RequestEvent): Promise<Response> {
	if (!isDevAuthEnabled()) {
		return new Response('Dev auth is not enabled', { status: 403 })
	}

	const role = event.url.searchParams.get('role')
	const provider = event.url.searchParams.get('provider')

	const parsedRole = role === 'admin' ? 'admin' : 'user'
	const parsedProvider = provider === 'github' || provider === 'google' ? provider : undefined

	issueDevSession(event, {
		role: parsedRole,
		provider: parsedProvider
	})

	return redirect(302, '/')
}
