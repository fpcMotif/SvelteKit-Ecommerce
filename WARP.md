# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

Project: SvelteKit e-commerce app (Stripe payments, Cloudinary images, Drizzle ORM w/ PlanetScale, Lucia auth, Vercel deploy)

Commands

- Dev server

```bash path=null start=null
pnpm dev
```

- Build and preview

```bash path=null start=null
pnpm build
pnpm preview
```

- Typecheck

```bash path=null start=null
pnpm check
pnpm check:watch
```

- Lint and format

```bash path=null start=null
pnpm lint
pnpm format
```

- Database (Drizzle + PlanetScale)

```bash path=null start=null
# Generate (uses drizzle.config.ts)
pnpm generate
# Push schema to MySQL
pnpm db:push
# Studio UI
pnpm db:studio
# Seed data (requires Stripe/Cloudinary vars configured in seed.ts comments)
pnpm db:seed
```

- Stripe webhook (local dev; requires Stripe CLI)

```bash path=null start=null
pnpm stripe:listen
```

- React Email preview server (for templates in src/lib/emails)

```bash path=null start=null
pnpm email:dev
```

- Tests

```bash path=null start=null
# No test runner or scripts are configured in this repo.
```

Environment variables

Configure a .env file before running locally. Key vars discovered in code/README:

- Cloudinary: VITE_PUBLIC_CLOUDINARY_CLOUD_NAME, PUBLIC_CLOUDINARY_UPLOAD_PRESET, CLOUDINARY_API_SECRET
- PlanetScale (MySQL): DATABASE_HOST, DATABASE_USERNAME, DATABASE_PASSWORD, DATABASE_CONNECTION_STRING
- Stripe: PUBLIC_STRIPE_PUBLIC_KEY, STRIPE_SECRET_KEY, STRIPE_WEBHOOK_SECRET
- OAuth (GitHub/Google): GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET, GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET
- Email (Resend): RESEND_API_KEY
- Optional: VERCEL_URL (used to compute OAuth/email callback base URL)

Architecture overview

- Routing (SvelteKit)

  - Public pages under src/routes (e.g., /, /products, /cart, /auth, /status).
  - Server endpoints under src/routes/api (e.g., /api/stripe webhook, /api/cloudinary signature).
  - Layout data in src/routes/+layout.server.ts computes collections, pieces, and site-wide flags.
  - Request lifecycle: src/hooks.server.ts validates Lucia session and populates event.locals.user/session.

- Auth (Lucia v3 + Arctic OAuth)

  - Config: src/lib/server/auth.ts sets up Lucia with DrizzleMySQLAdapter and providers (GitHub, Google).
  - OAuth flows: src/routes/auth/login/_ and src/routes/auth/callback/_.
  - Authorization helper: ensureAdmin(locals) redirects non-admins.

- Data layer and DB (Drizzle ORM + PlanetScale)

  - Connection: src/lib/server/db/index.ts via @planetscale/database and drizzle-orm/planetscale-serverless.
  - Schema: src/lib/server/db/schema.ts defines all tables, relations (users, sessions, products, sizes, tags, images, reviews, orders,...).
  - Queries/helpers: src/lib/server/data/\*.ts encapsulate common operations (products, orders).
  - Migrations/config: drizzle.config.ts; scripts in package.json. seed.ts provides example data flow.

- Payments (Stripe)

  - Client checkout creation: src/routes/cart/+page.server.ts builds line_items, adds shipping if total < $125, sets metadata.
  - Webhook handler: src/routes/api/stripe/+server.ts verifies signature, persists orders/order items, links Stripe customer to user, and triggers purchase email.
  - Stripe SDK setup: src/lib/server/stripe.ts.

- Media (Cloudinary)

  - Upload signature endpoint: src/routes/api/cloudinary/+server.ts.
  - Images linked via product_image table; admin flow manages primary/vertical flags.

- Email (Resend + react-email)

  - Transport: src/lib/server/resend.tsx using RESEND_API_KEY.
  - Templates: src/lib/emails/\*.tsx (SedimentListThankYou, SedimentPurchaseThankYou) with Tailwind.
  - Unsubscribe flow: /auth/list and /auth/list/remove.

- Admin area

  - Guarded by src/routes/admin/+layout.server.ts using ensureAdmin.
  - Features: product CRUD (new, basics, sizes, images, tags), CSV import for Stripe price list, order management with status updates.

- Client state

  - Cart stored in localStorage via src/lib/client/cart.ts with a Svelte store for count; server action creates Stripe session.

- UI/Styling
  - TailwindCSS with custom CSS vars and fonts (tailwind.config.js). Component library under src/lib/components (ShadCN-inspired + bits-ui).
  - TS config enables JSX ("jsx": "react") for email templates alongside Svelte.

Development workflows and notes

- After DB variables are set: pnpm db:push, then seed via pnpm db:seed (update TODOs in seed.ts for Stripe/Cloudinary IDs first).
- For OAuth in dev, callbacks use http://localhost:5173 unless VERCEL_URL is set. GitHub: /auth/callback/github, Google: /auth/callback/google.
- To test checkout end-to-end locally: run pnpm dev, pnpm stripe:listen (to forward webhooks to /api/stripe), add items to cart, start checkout.
- Email templates can be previewed with pnpm email:dev; production sends via Resend in webhook/list signup flows.
