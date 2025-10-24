import { env } from '$env/dynamic/private'
import { PUBLIC_DEV_AUTH_ENABLED } from '$env/static/public'

export function isDevAuthEnabled(): boolean {
	return env.DEV_AUTH_ENABLED === 'true'
}

export function isPublicDevAuthEnabled(): boolean {
	return PUBLIC_DEV_AUTH_ENABLED === 'true'
}
