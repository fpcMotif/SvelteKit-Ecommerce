import { convexAuthNextjsToken } from '@convex-dev/auth/nextjs/server'
import { redirect } from '@sveltejs/kit'

export function ensureAdmin(locals: App.Locals) {
	if (!locals.user || !locals.session) {
		redirect(303, '/auth/login')
	}

	if (!locals.user.isAdmin) {
		redirect(303, '/')
	}
}
