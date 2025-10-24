import { ConvexHttpClient } from 'convex/browser'
import { PUBLIC_CONVEX_URL } from '$env/static/public'

export const convexHttp = new ConvexHttpClient(PUBLIC_CONVEX_URL)
