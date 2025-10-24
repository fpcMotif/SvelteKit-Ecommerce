export default {
	'**/*.{js,jsx,ts,tsx,svelte}': ['bunx oxlint --fix --', 'bunx biome format --write --'],
	'**/*.{json,jsonc,css,scss,md,mdx}': ['bunx biome format --write --']
}
