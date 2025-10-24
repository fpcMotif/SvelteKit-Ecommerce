import type { RequestEvent } from '@sveltejs/kit'
import { error, json } from '@sveltejs/kit'
import { v2 as cloudinary } from 'cloudinary'
import { env } from '$env/dynamic/private'

export const POST = async ({ request }: RequestEvent) => {
	const body = await request.json()
	const { paramsToSign } = body

	if (!env.CLOUDINARY_API_SECRET) {
		throw error(500, 'CLOUDINARY_API_SECRET environment variable not configured')
	}

	try {
		const signature = cloudinary.utils.api_sign_request(paramsToSign, env.CLOUDINARY_API_SECRET)
		return json({ signature })
	} catch (e) {
		console.error(e)
		throw error(500, (e as Error).message)
	}
}
