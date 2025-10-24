<script lang="ts">
import { Drawer as DrawerPrimitive } from 'vaul-svelte'
import { cn } from '$lib/utils'

type Props = {
	class?: string
	children?: import('svelte').Snippet
}

let { class: className, children, ...restProps }: Props = $props()
</script>

<DrawerPrimitive.Description
	class={cn('text-sm text-muted-foreground', className)}
	{...restProps}
>
	{@render children?.()}
</DrawerPrimitive.Description>
