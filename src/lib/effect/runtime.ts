import * as Effect from 'effect/Effect'
import { ConvexLive } from './convex'

export const MainLayer = ConvexLive

export const runPromise = <A, E>(effect: Effect.Effect<A, E, never>) => Effect.runPromise(effect)

export const runPromiseLayer = <A, E, R>(effect: Effect.Effect<A, E, R>) =>
	Effect.runPromise(Effect.provide(effect, MainLayer))

export const runSync = <A, E>(effect: Effect.Effect<A, E, never>) => Effect.runSync(effect)

export const runSyncLayer = <A, E, R>(effect: Effect.Effect<A, E, R>) =>
	Effect.runSync(Effect.provide(effect, MainLayer))
