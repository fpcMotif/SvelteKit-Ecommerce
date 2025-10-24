<script lang="ts">
import { DropdownMenu as DropdownMenuPrimitive } from 'bits-ui'
import { Check } from 'lucide-svelte'
import { cn } from '$lib/utils'

type Props = DropdownMenuPrimitive.CheckboxItemProps & {
	children?: import('svelte').Snippet
}

let { class: className, checked = $bindable(), children, ...restProps }: Props = $props()
</script>

<DropdownMenuPrimitive.CheckboxItem
	bind:checked
	class={cn(
		'relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none data-[highlighted]:bg-accent data-[highlighted]:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
		className
	)}
	{...restProps}
>
	<span class="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
		{#if checked}
			<Check class="h-4 w-4" />
		{/if}
	</span>
	{@render children?.()}
</DropdownMenuPrimitive.CheckboxItem>
