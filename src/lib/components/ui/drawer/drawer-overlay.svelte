<script lang="ts">
import { Drawer as DrawerPrimitive } from 'vaul-svelte'
import { cn } from '$lib/utils'

type Props = {
	class?: string
	children?: import('svelte').Snippet
}

let { class: className, children, ...restProps }: Props = $props()
</script>

<DrawerPrimitive.Overlay
	class={cn('fixed inset-0 z-50 bg-black/80', className)}
	{...restProps}
>
	{@render children?.()}
</DrawerPrimitive.Overlay>
