import type { Handle } from '@sveltejs/kit'
import { isDevAuthEnabled } from '$lib/server/auth/env'
import { readDevSession } from '$lib/server/auth/mock'
import { convexHttp } from '$lib/server/convex'
import { api } from '../convex/_generated/api'

export const handle: Handle = async ({ event, resolve }) => {
	// Dev authentication mode
	if (isDevAuthEnabled()) {
		const devAuth = readDevSession(event)
		if (devAuth) {
			event.locals.user = devAuth.user
			event.locals.session = devAuth.session
			return resolve(event)
		}

		event.locals.user = null
		event.locals.session = null
		return resolve(event)
	}

	// Convex Auth mode
	const token = event.cookies.get('__convexAuthJWT')

	if (!token) {
		event.locals.user = null
		event.locals.session = null
		return resolve(event)
	}

	try {
		// Fetch user from Convex using the auth token
		const user = await convexHttp.query(api.users.getByExternalId, { externalId: token }, { token })

		if (user) {
			event.locals.user = {
				id: user._id,
				firstName: user.firstName || '',
				lastName: user.lastName || '',
				email: user.email,
				isAdmin: user.isAdmin,
				stripeCustomerId: user.stripeCustomerId || null
			}
			event.locals.session = {
				id: token,
				userId: user._id,
				expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
				fresh: false
			}
		} else {
			event.locals.user = null
			event.locals.session = null
		}
	} catch (error) {
		console.error('Failed to validate session:', error)
		event.locals.user = null
		event.locals.session = null
	}

	return resolve(event)
}
