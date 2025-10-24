declare module '@convex-dev/auth/client' {
	export function createAuth(client: any): {
		useAuthActions: () => any
	}
}
