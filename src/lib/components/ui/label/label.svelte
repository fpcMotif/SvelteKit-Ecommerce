<script lang="ts">
import { Label as LabelPrimitive } from 'bits-ui'
import { cn } from '$lib/utils'

type Props = {
	for?: string
	class?: string
	children?: import('svelte').Snippet
}

let { for: htmlFor, class: className, children, ...restProps }: Props = $props()
</script>

<LabelPrimitive.Root
	for={htmlFor}
	class={cn(
		'text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70',
		className
	)}
	{...restProps}
>
	{@render children?.()}
</LabelPrimitive.Root>
