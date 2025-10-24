import type { FunctionArgs, FunctionReference, FunctionReturnType } from 'convex/server'
import * as Context from 'effect/Context'
import * as Effect from 'effect/Effect'
import * as Layer from 'effect/Layer'
import { convexHttp } from '$lib/server/convex'

export class ConvexError {
	readonly _tag = 'ConvexError'
	constructor(
		readonly message: string,
		readonly cause?: unknown
	) {}
}

export interface ConvexService {
	readonly query: <Query extends FunctionReference<'query'>>(
		query: Query,
		args: FunctionArgs<Query>
	) => Effect.Effect<FunctionReturnType<Query>, ConvexError>

	readonly mutation: <Mutation extends FunctionReference<'mutation'>>(
		mutation: Mutation,
		args: FunctionArgs<Mutation>
	) => Effect.Effect<FunctionReturnType<Mutation>, ConvexError>

	readonly action: <Action extends FunctionReference<'action'>>(
		action: Action,
		args: FunctionArgs<Action>
	) => Effect.Effect<FunctionReturnType<Action>, ConvexError>
}

export const ConvexService = Context.GenericTag<ConvexService>('@services/ConvexService')

export const ConvexLive = Layer.succeed(
	ConvexService,
	ConvexService.of({
		query: (query, args) =>
			Effect.tryPromise({
				try: () => convexHttp.query(query, args),
				catch: (error) => new ConvexError('Query failed', error)
			}),

		mutation: (mutation, args) =>
			Effect.tryPromise({
				try: () => convexHttp.mutation(mutation, args),
				catch: (error) => new ConvexError('Mutation failed', error)
			}),

		action: (action, args) =>
			Effect.tryPromise({
				try: () => convexHttp.action(action, args),
				catch: (error) => new ConvexError('Action failed', error)
			})
	})
)

export const query = <Query extends FunctionReference<'query'>>(
	query: Query,
	args: FunctionArgs<Query>
) =>
	Effect.gen(function* () {
		const convex = yield* ConvexService
		return yield* convex.query(query, args)
	})

export const mutation = <Mutation extends FunctionReference<'mutation'>>(
	mutation: Mutation,
	args: FunctionArgs<Mutation>
) =>
	Effect.gen(function* () {
		const convex = yield* ConvexService
		return yield* convex.mutation(mutation, args)
	})

export const action = <Action extends FunctionReference<'action'>>(
	action: Action,
	args: FunctionArgs<Action>
) =>
	Effect.gen(function* () {
		const convex = yield* ConvexService
		return yield* convex.action(action, args)
	})
