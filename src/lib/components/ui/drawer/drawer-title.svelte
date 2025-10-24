<script lang="ts">
import { Drawer as DrawerPrimitive } from 'vaul-svelte'
import { cn } from '$lib/utils'

type Props = {
	class?: string
	children?: import('svelte').Snippet
}

let { class: className, children, ...restProps }: Props = $props()
</script>

<DrawerPrimitive.Title
	class={cn('text-lg font-semibold leading-none tracking-tight', className)}
	{...restProps}
>
	{@render children?.()}
</DrawerPrimitive.Title>
