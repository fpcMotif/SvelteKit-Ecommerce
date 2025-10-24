<script lang="ts">
import { DropdownMenu as DropdownMenuPrimitive } from 'bits-ui'
import { cn, flyAndScale } from '$lib/utils'

type Props = DropdownMenuPrimitive.SubContentProps & {
	children?: import('svelte').Snippet
}

let { class: className, children, ...restProps }: Props = $props()
</script>

<DropdownMenuPrimitive.SubContent
	class={cn(
		'z-50 min-w-[8rem] rounded-md border bg-popover p-1 text-popover-foreground shadow-lg focus:outline-none',
		className
	)}
	{...restProps}
>
	{@render children?.()}
</DropdownMenuPrimitive.SubContent>
