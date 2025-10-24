import type { RequestEvent } from '@sveltejs/kit'

const DEV_COOKIE_NAME = 'dev_auth'

type DevUser = {
	id: string
	firstName: string
	lastName: string
	email: string
	isAdmin: boolean
	stripeCustomerId: string | null
}

type DevSession = {
	id: string
	userId: string
	expiresAt: Date
	fresh: boolean
}

type DevAuthData = {
	user: DevUser
	session: DevSession
}

export function issueDevSession(
	event: RequestEvent,
	opts: { role: 'admin' | 'user'; provider?: 'github' | 'google' }
): void {
	const userId = `dev_user_${Date.now()}`
	const sessionId = `dev_session_${Date.now()}`

	const user: DevUser = {
		id: userId,
		firstName: 'Dev',
		lastName: opts.role === 'admin' ? 'Admin' : 'User',
		email: opts.role === 'admin' ? 'dev.admin@example.com' : 'dev.user@example.com',
		isAdmin: opts.role === 'admin',
		stripeCustomerId: null
	}

	const session: DevSession = {
		id: sessionId,
		userId,
		expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
		fresh: true
	}

	const authData: DevAuthData = { user, session }

	event.cookies.set(DEV_COOKIE_NAME, JSON.stringify(authData), {
		path: '/',
		httpOnly: true,
		sameSite: 'lax',
		maxAge: 60 * 60 * 24 * 30
	})
}

export function clearDevSession(event: RequestEvent): void {
	event.cookies.delete(DEV_COOKIE_NAME, {
		path: '/'
	})
}

export function readDevSession(event: RequestEvent): DevAuthData | null {
	const cookieValue = event.cookies.get(DEV_COOKIE_NAME)

	if (!cookieValue) {
		return null
	}

	try {
		const authData = JSON.parse(cookieValue) as DevAuthData
		const expiresAt = new Date(authData.session.expiresAt)

		if (expiresAt < new Date()) {
			clearDevSession(event)
			return null
		}

		return authData
	} catch {
		clearDevSession(event)
		return null
	}
}

