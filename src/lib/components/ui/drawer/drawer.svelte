<script lang="ts">
import { Drawer as DrawerPrimitive } from 'vaul-svelte'

type Props = {
	shouldScaleBackground?: boolean
	open?: boolean
	activeSnapPoint?: number | string | null
	children?: import('svelte').Snippet
}

let {
	shouldScaleBackground = true,
	open = $bindable(false),
	activeSnapPoint = $bindable(undefined),
	children,
	...restProps
}: Props = $props()
</script>

<DrawerPrimitive.Root {shouldScaleBackground} bind:open bind:activeSnapPoint {...restProps}>
	{@render children?.()}
</DrawerPrimitive.Root>
