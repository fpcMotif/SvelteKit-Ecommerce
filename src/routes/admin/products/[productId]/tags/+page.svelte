<script lang="ts">
import { PlusCircle, Trash } from 'lucide-svelte'
import { enhance } from '$app/forms'
import { invalidateAll } from '$app/navigation'
import Button from '$lib/components/ui/button/button.svelte'
import { Input } from '$lib/components/ui/input'
import { Label } from '$lib/components/ui/label'
import * as Table from '$lib/components/ui/table'

export let data: { tags: string[] } = { tags: [] }

let newTag = ''
</script>

<div class="w-full h-full flex flex-col p-4 gap-4">
	<div class="grow overflow-auto">
		<Table.Root>
			<Table.Header>
				<Table.Row>
					<Table.Head>Tag Name</Table.Head>
					<Table.Head class="text-right">Actions</Table.Head>
				</Table.Row>
			</Table.Header>
			<Table.Body>
				{#each data.tags as tag (tag)}
					<Table.Row>
						<Table.Cell class="font-medium">{tag}</Table.Cell>
						<Table.Cell class="text-right">
							<form
								method="POST"
								action="?/remove"
								use:enhance={() => {
									return ({ result }) => {
										if (result.type === 'success') {
											invalidateAll();
										}
									};
								}}
							>
								<input type="hidden" name="tag" value={tag} />
								<Button size="sm" variant="destructive" type="submit" aria-label={`Remove ${tag}`}>
									<Trash class="w-4 h-4 mr-2" />
									Remove
								</Button>
							</form>
						</Table.Cell>
					</Table.Row>
				{/each}
			</Table.Body>
		</Table.Root>
	</div>

	<div class="w-full flex flex-col gap-4 border-t pt-4">
		<h3 class="text-lg font-semibold">Add New Tag</h3>
		<form
			method="POST"
			action="?/add"
			class="flex flex-row gap-4"
			use:enhance={() => {
				return ({ result }) => {
					if (result.type === 'success') {
						newTag = '';
						invalidateAll();
					}
				};
			}}
		>
			<div class="gap-1.5 grid grow">
				<Label for="tag">Tag Name</Label>
				<Input
					id="tag"
					name="tag"
					type="text"
					class="w-full"
					placeholder="Sediment Collection"
					bind:value={newTag}
					required
				/>
			</div>
			<div class="flex items-end">
				<Button type="submit" class="bg-green-600 text-white">
					<PlusCircle class="w-4 h-4 mr-2" />
					Add Tag
				</Button>
			</div>
		</form>
	</div>
</div>
