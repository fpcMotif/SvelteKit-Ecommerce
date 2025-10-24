<script lang="ts">
import { Accordion as AccordionPrimitive } from 'bits-ui'
import { cn } from '$lib/utils'

type $$Props = AccordionPrimitive.ContentProps

let className: $$Props['class'] = undefined
export { className as class }
</script>

<AccordionPrimitive.Content
	class={cn('overflow-hidden text-sm', className)}
	{...$$restProps}
>
	<div class="pb-4 pt-0">
		<slot />
	</div>
</AccordionPrimitive.Content>
