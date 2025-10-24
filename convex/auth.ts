import GitHub from '@auth/core/providers/github'
import Google from '@auth/core/providers/google'
import { convexAuth } from '@convex-dev/auth/server'

export const { auth, signIn, signOut, store } = convexAuth({
	providers: [
		GitHub({
			clientId: process.env.GITHUB_CLIENT_ID || 'dev-placeholder',
			clientSecret: process.env.GITHUB_CLIENT_SECRET || 'dev-placeholder'
		}),
		Google({
			clientId: process.env.GOOGLE_CLIENT_ID || 'dev-placeholder',
			clientSecret: process.env.GOOGLE_CLIENT_SECRET || 'dev-placeholder'
		})
	]
})
