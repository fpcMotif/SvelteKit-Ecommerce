<script lang="ts">
import { DropdownMenu as DropdownMenuPrimitive } from 'bits-ui'
import { cn } from '$lib/utils'

type Props = DropdownMenuPrimitive.ContentProps & {
	children?: import('svelte').Snippet
}

let { class: className, sideOffset = 4, children, ...restProps }: Props = $props()
</script>

<DropdownMenuPrimitive.Content
	{sideOffset}
	class={cn(
		'z-50 min-w-[8rem] rounded-md border bg-popover p-1 text-popover-foreground shadow-md focus:outline-none',
		className
	)}
	{...restProps}
>
	{@render children?.()}
</DropdownMenuPrimitive.Content>
