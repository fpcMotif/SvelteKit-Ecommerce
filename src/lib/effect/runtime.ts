import * as Effect from 'effect/Effect'
import { ConvexLive, type ConvexService } from './convex'

export const MainLayer = ConvexLive

export const runPromise = <A, E>(effect: Effect.Effect<A, E, never>) => Effect.runPromise(effect)

export const runPromiseLayer = <A, E>(effect: Effect.Effect<A, E, ConvexService>) =>
	Effect.runPromise(Effect.provide(effect, MainLayer))

export const runSync = <A, E>(effect: Effect.Effect<A, E, never>) => Effect.runSync(effect)

export const runSyncLayer = <A, E>(effect: Effect.Effect<A, E, ConvexService>) =>
	Effect.runSync(Effect.provide(effect, MainLayer))
