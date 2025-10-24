import { createAuth } from '@convex-dev/auth/client'
import { convexClient } from './convex'

export const { useAuthActions } = createAuth(convexClient)

export function signInWithProvider(provider: 'github' | 'google') {
	window.location.href = `/auth/login/${provider}`
}

export async function signOutUser() {
	window.location.href = '/auth/logout'
}
