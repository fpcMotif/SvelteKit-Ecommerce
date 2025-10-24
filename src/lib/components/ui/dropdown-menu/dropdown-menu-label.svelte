<script lang="ts">
import { cn } from '$lib/utils'

type Props = {
	inset?: boolean
	class?: string
	children?: import('svelte').Snippet
}

let { class: className, inset, children, ...restProps }: Props = $props()
</script>

<div
	class={cn('px-2 py-1.5 text-sm font-semibold', inset && 'pl-8', className)}
	{...restProps}
>
	{@render children?.()}
</div>
