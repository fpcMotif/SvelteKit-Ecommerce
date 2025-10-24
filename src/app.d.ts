// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			user: {
				id: string
				firstName: string
				lastName: string
				email: string
				isAdmin: boolean
				stripeCustomerId: string | null
			} | null
			session: {
				id: string
				userId: string
				expiresAt: Date
				fresh: boolean
			} | null
		}
		// interface PageData {}
		// interface Platform {}
	}
}

export {}
