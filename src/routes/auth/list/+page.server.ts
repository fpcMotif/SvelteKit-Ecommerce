import { error, redirect } from '@sveltejs/kit'
import { generateId } from 'lucia'
import { zfd } from 'zod-form-data'
import { convexHttp } from '$lib/server/convex'
import { sendThankYouListEmail } from '$lib/server/resend'
import { api } from '../../../../convex/_generated/api'

export const actions = {
	default: async ({ request }) => {
		const data = await request.formData()

		const schema = zfd.formData({
			email: zfd.text()
		})

		const res = schema.safeParse(data)

		if (!res.success) {
			error(400, res.error.name)
		}

		const key = generateId(20)

		await convexHttp.mutation(api.emailList.subscribe, {
			email: res.data.email,
			key
		})

		await sendThankYouListEmail(res.data.email, key)

		redirect(303, '/')
	}
}
