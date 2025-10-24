<script lang="ts">
import { cn } from '$lib/utils'
import { buttonVariants, type Props } from '.'

type $$Props = Props & {
	href?: string
	type?: 'button' | 'submit' | 'reset'
	disabled?: boolean
}

let className: $$Props['class'] = undefined
export let variant: $$Props['variant'] = 'default'
export let size: $$Props['size'] = 'default'
export let href: $$Props['href'] = undefined
export let type: $$Props['type'] = 'button'
export let disabled: $$Props['disabled'] = undefined
export { className as class }
</script>

{#if href}
	<a
		{href}
		class={cn(buttonVariants({ variant, size, className }))}
		{...$$restProps}
	>
		<slot />
	</a>
{:else}
	<button
		{type}
		{disabled}
		class={cn(buttonVariants({ variant, size, className }))}
		{...$$restProps}
	>
		<slot />
	</button>
{/if}
