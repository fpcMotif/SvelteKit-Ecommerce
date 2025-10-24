<script lang="ts">
import { DropdownMenu as DropdownMenuPrimitive } from 'bits-ui'
import { cn } from '$lib/utils'

type Props = DropdownMenuPrimitive.ItemProps & {
	inset?: boolean
	children?: import('svelte').Snippet
}

let { class: className, inset, children, ...restProps }: Props = $props()
</script>

<DropdownMenuPrimitive.Item
	class={cn(
		'relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none data-[highlighted]:bg-accent data-[highlighted]:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
		inset && 'pl-8',
		className
	)}
	{...restProps}
>
	{@render children?.()}
</DropdownMenuPrimitive.Item>
