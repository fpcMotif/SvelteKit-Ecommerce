import { render } from '@react-email/render'
import type { ReactElement } from 'react'

export interface EmailOptions {
	to: string
	subject: string
	componentHtml: ReactElement
}

export async function sendEmail({ to, subject, componentHtml }: EmailOptions): Promise<void> {
	const html = await render(componentHtml)

	if (process.env.POSTMARK_API_TOKEN) {
		const { ServerClient } = await import('postmark')
		const client = new ServerClient(process.env.POSTMARK_API_TOKEN)
		await client.sendEmail({
			From: process.env.EMAIL_FROM || 'no-reply@yourdomain.com',
			To: to,
			Subject: subject,
			HtmlBody: html
		})
		return
	}

	if (process.env.SMTP_HOST) {
		const nodemailer = await import('nodemailer')
		const transporter = nodemailer.createTransport({
			host: process.env.SMTP_HOST,
			port: Number(process.env.SMTP_PORT ?? 587),
			secure: false,
			auth: {
				user: process.env.SMTP_USER,
				pass: process.env.SMTP_PASS
			}
		})
		await transporter.sendMail({
			from: process.env.EMAIL_FROM || 'no-reply@yourdomain.com',
			to,
			subject,
			html
		})
		return
	}

	console.warn('[email] Email service not configured (POSTMARK_API_TOKEN or SMTP_*). Skipping send.')
	console.log('[email] Email preview:', { to, subject, html: html.slice(0, 200) })
}
