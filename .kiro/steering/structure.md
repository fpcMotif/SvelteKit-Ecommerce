# Project Structure

## Root Configuration

- `package.json` - Dependencies and scripts (uses Bun)
- `svelte.config.js` - SvelteKit config with Vercel adapter
- `vite.config.ts` - Vite build configuration
- `tsconfig.json` - TypeScript config (strict mode, Effect plugin)
- `biome.json` - Code formatting rules
- `oxlint.json` - Linting configuration
- `tailwind.config.js` - TailwindCSS setup
- `.env.example` - Environment variable template

## Source Directory (`src/`)

### Routes (`src/routes/`)

SvelteKit file-based routing:

- `/` - Homepage
- `/about/` - About page
- `/products/` - Product catalog and detail pages
- `/cart/` - Shopping cart
- `/profile/` - User profile and order history
- `/admin/` - Admin dashboard (orders, products)
- `/auth/` - Authentication callbacks and email list
- `/api/` - API endpoints (Stripe webhooks)
- `/status/` - Status pages

### Library (`src/lib/`)

- `components/` - Reusable Svelte components
  - `ui/` - shadcn-svelte UI components
  - `layout/` - NavBar, Footer
  - `admin/` - Admin-specific components
- `server/` - Server-side utilities and integrations
  - `convex.ts` - Convex HTTP client
  - `stripe.ts` - Stripe integration
  - `email.ts` - Email sending
- `client/` - Client-side utilities
- `effect/` - Effect schemas and utilities
- `emails/` - React Email templates
- `assets/` - Static assets
- `utils.ts` - Shared utility functions

## Backend (`convex/`)

Convex backend functions and schema:

- `schema.ts` - Database schema definition
- `auth.ts` - Authentication configuration
- `users.ts` - User queries and mutations
- `products.ts` - Product queries and mutations
- `orders.ts` - Order queries and mutations
- `emailList.ts` - Email subscription management
- `checkout.ts` - Checkout logic
- `http.ts` - HTTP endpoints
- `seed.ts` - Database seeding script
- `_generated/` - Auto-generated Convex types

## Key Patterns

### Data Flow

1. Client makes request to SvelteKit route
2. Server-side load function uses `convexHttp` client
3. Convex functions query/mutate database
4. Data returned to client via page props

### Authentication

- Convex Auth handles OAuth (Google, GitHub)
- Session stored in Convex
- User data synced to Convex users table

### Product Structure

Products have nested arrays for:
- `images[]` - Multiple images with metadata
- `sizes[]` - Available sizes with Stripe price IDs
- `tags[]` - Product categorization

### Environment Variables

- `PUBLIC_*` - Exposed to client (Cloudinary, Stripe public key)
- Private vars - Server-only (Stripe secret, API keys)
- Convex vars - Set via `npx convex env set`

## Migration Notes

The project recently migrated from Drizzle ORM to Convex. Some admin product management pages may still reference old patterns. New code should use:

- `convexHttp.query(api.*.*)` for reads
- `convexHttp.mutation(api.*.*)` for writes
- Convex schema types from `convex/_generated`
