# Tech Stack

## Core Framework

- SvelteKit 2.x (full-stack framework)
- Svelte 5.x (UI framework with runes)
- TypeScript (strict mode enabled)
- Vite (build tool)

## Backend & Database

- Convex (backend-as-a-service, real-time database)
- Convex Auth (@convex-dev/auth) for authentication
- Effect (functional programming library with Effect Schema)

## Styling & UI

- TailwindCSS 4.x (utility-first CSS)
- Biome (formatter, replaces Prettier)
- shadcn-svelte (UI component library via bits-ui)
- Lucide Svelte (icons)

## External Services

- Stripe (payments and webhooks)
- Cloudinary (image hosting)
- Resend/Postmark (email delivery)
- Vercel (deployment platform)

## Development Tools

- Bun (package manager and runtime)
- oxlint (linter)
- Husky (git hooks)
- lint-staged (pre-commit checks)
- Ultracite (additional code quality)

## Common Commands

```bash
# Development
bun run dev                    # Start dev server
bun run build                  # Production build
bun run preview                # Preview production build

# Code Quality
bun run check                  # Type check with svelte-check
bun run check:all              # Full check (types + lint + format)
bun run lint                   # Run oxlint
bun run format                 # Format with Biome
bun run format:check           # Check formatting

# Stripe
bun run stripe:listen          # Listen to Stripe webhooks locally

# Email Development
bun run email:dev              # React Email dev server

# Git Hooks
bun run prepare                # Setup Husky hooks
```

## Code Style

- Tabs for indentation (width: 1)
- Single quotes for strings
- No semicolons (semicolons: asNeeded)
- No trailing commas
- Line width: 100 characters
- Svelte files are not formatted by Biome (use Svelte formatter)
