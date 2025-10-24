<script lang="ts">
import { Edit, MoreVertical, PlusCircle, Trash } from 'lucide-svelte'
import { applyAction, deserialize } from '$app/forms'
import { invalidateAll } from '$app/navigation'
import Button from '$lib/components/ui/button/button.svelte'
import * as DropdownMenu from '$lib/components/ui/dropdown-menu'
import { Input } from '$lib/components/ui/input'
import { Label } from '$lib/components/ui/label'
import * as Sheet from '$lib/components/ui/sheet'
import * as Table from '$lib/components/ui/table'

export let data: {
	sizes: Array<{
		code: string
		name: string
		width: number
		height: number
		price: number
		stripePriceId: string
		stripeProductId: string
		isAvailable: boolean
		productId: string
	}>
} = { sizes: [] }

let openEditModal = false
let editIdx: number | null = null

let createOpen = false

async function handleSubmitCreate(event: { currentTarget: EventTarget & HTMLFormElement }) {
	const formData = new FormData(event.currentTarget)

	const response = await fetch(event.currentTarget.action, {
		method: 'POST',
		body: formData
	})

	const result = deserialize(await response.text())

	if (result.type === 'success') {
		await invalidateAll()
	}

	applyAction(result)

	createOpen = false
}

async function handleSubmitDelete(event: { currentTarget: EventTarget & HTMLFormElement }) {
	const formData = new FormData(event.currentTarget)

	const response = await fetch(event.currentTarget.action, {
		method: 'POST',
		body: formData
	})

	const result = deserialize(await response.text())

	if (result.type === 'success') {
		await invalidateAll()
	}

	applyAction(result)
}

async function handleSubmitEdit(event: { currentTarget: EventTarget & HTMLFormElement }) {
	const formData = new FormData(event.currentTarget)

	const response = await fetch(event.currentTarget.action, {
		method: 'POST',
		body: formData
	})

	const result = deserialize(await response.text())

	if (result.type === 'success') {
		await invalidateAll()
	}

	applyAction(result)

	openEditModal = false
}
</script>

<div class="w-full h-full flex flex-col p-4">
	<div class="grow overflow-auto">
		<Table.Root>
			<Table.Header>
				<Table.Row>
					<Table.Head class="w-[100px]">Code</Table.Head>
					<Table.Head>Name</Table.Head>
					<Table.Head>Width</Table.Head>
					<Table.Head>Height</Table.Head>
					<Table.Head>Price</Table.Head>
					<Table.Head>Available</Table.Head>
					<Table.Head>Stripe Price ID</Table.Head>
					<Table.Head>Stripe Product ID</Table.Head>
					<Table.Head></Table.Head>
				</Table.Row>
			</Table.Header>
			<Table.Body>
				{#each data.sizes as size, i (i)}
					<Table.Row>
						<Table.Cell class="font-medium">{size.code}</Table.Cell>
						<Table.Cell>{size.name}</Table.Cell>
						<Table.Cell>{size.width}</Table.Cell>
						<Table.Cell>{size.height}</Table.Cell>
						<Table.Cell>{`$${(size.price / 100).toFixed(2)}`}</Table.Cell>
						<Table.Cell>{size.isAvailable ? 'Yes' : 'No'}</Table.Cell>
						<Table.Cell>{size.stripePriceId}</Table.Cell>
						<Table.Cell>{size.stripeProductId}</Table.Cell>
						<Table.Cell class="text-right">
							<DropdownMenu.Root>
								<DropdownMenu.Trigger>
									<MoreVertical class="w-4 h-4" />
								</DropdownMenu.Trigger>
								<DropdownMenu.Content>
									<DropdownMenu.Group>
										<DropdownMenu.Label>Manage</DropdownMenu.Label>
										<DropdownMenu.Separator />

										<DropdownMenu.Item
											onclick={() => {
												editIdx = i;
												openEditModal = true;
											}}
										>
											<Edit class="w-4 h-4 mr-2" />Edit
										</DropdownMenu.Item>

										<DropdownMenu.Item>
											<form
												method="POST"
												action="?/delete"
												onsubmit={(e) => {
													e.preventDefault();
													handleSubmitDelete(e);
												}}
											>
												<input type="text" name="code" id="code" value={size.code} class="hidden" />
												<button type="submit" class="flex flex-row items-center w-full h-full">
													<Trash class="w-4 h-4 mr-2" />Delete
												</button>
											</form>
										</DropdownMenu.Item>
									</DropdownMenu.Group>
								</DropdownMenu.Content>
							</DropdownMenu.Root>
						</Table.Cell>
					</Table.Row>
				{/each}
			</Table.Body>
		</Table.Root>
	</div>

	<div class="w-full flex flex-row justify-end pt-4">
		<Sheet.Root bind:open={createOpen}>
			<Sheet.Trigger>
				<Button class="text-white bg-green-600"
					><PlusCircle class="w-4 h-4 mr-2" />Create New Size</Button
				>
			</Sheet.Trigger>
			<Sheet.Content>
				<Sheet.Header class="mb-4">
					<Sheet.Title>Create New Size</Sheet.Title>
				</Sheet.Header>

				<form
					class="flex flex-col gap-y-6"
					method="POST"
					action="?/create"
					onsubmit={(e) => {
						e.preventDefault();
						handleSubmitCreate(e);
					}}
				>
					<div class="gap-1.5 grid">
						<Label for="code">Code</Label>
						<Input
							name="code"
							required
							id="code"
							class="w-full"
							type="text"
							placeholder="code_12_12"
						/>
					</div>

					<div class="gap-1.5 grid">
						<Label for="name">Name</Label>
						<Input name="name" required id="name" class="w-full" type="text" placeholder="12x12" />
					</div>

					<div class="gap-1.5 grid">
						<Label for="width">Width</Label>
						<Input name="width" required id="width" class="w-full" type="number" placeholder="12" />
					</div>

					<div class="gap-1.5 grid">
						<Label for="height">Height</Label>
						<Input
							name="height"
							required
							id="height"
							class="w-full"
							type="number"
							placeholder="12"
						/>
					</div>

					<div class="gap-1.5 grid">
						<Label for="price">Price (in cents)</Label>
						<Input
							name="price"
							required
							id="price"
							class="w-full"
							type="number"
							placeholder="5999"
						/>
					</div>

					<div class="gap-1.5 grid">
						<Label for="stripePriceId">Stripe Price Id</Label>
						<Input
							name="stripePriceId"
							required
							id="stripePriceId"
							class="w-full"
							type="text"
							placeholder="stripe1234..."
						/>
					</div>

					<div class="gap-1.5 grid">
						<Label for="stripeProductId">Stripe Product Id</Label>
						<Input
							name="stripeProductId"
							required
							id="stripeProductId"
							class="w-full"
							type="text"
							placeholder="stripe1234..."
						/>
					</div>

					<div class="gap-1.5 grid">
						<Label for="isAvailable">Available</Label>
						<input type="checkbox" name="isAvailable" id="isAvailable" checked />
					</div>

					<div class="flex flex-row justify-end">
						<Button type="submit">
							<PlusCircle class="w-4 h-4 mr-2" />
							Create</Button
						>
					</div>
				</form>
			</Sheet.Content>
		</Sheet.Root>
	</div>
</div>

<!-- EDIT SHEET -->
{#if editIdx !== null}
	<Sheet.Root
		bind:open={openEditModal}
		onOpenChange={(open) => {
			if (!open) {
				editIdx = null;
			}
		}}
	>
		<Sheet.Trigger>
			<Button class="text-white bg-green-600"><PlusCircle class="w-4 h-4 mr-2" />Edit Size</Button>
		</Sheet.Trigger>
		<Sheet.Content>
			<Sheet.Header class="mb-4">
				<Sheet.Title>Edit Size</Sheet.Title>
			</Sheet.Header>

			<form
				class="flex flex-col gap-y-6"
				method="POST"
				action="?/edit"
				onsubmit={(e) => {
					e.preventDefault();
					handleSubmitEdit(e);
				}}
			>
				<div class="gap-1.5 grid">
					<Label for="showCode">Code</Label>
					<Input
						name="showCode"
						required
						id="showCode"
						class="w-full"
						type="text"
						placeholder="code_12_12"
						disabled={true}
						value={data.sizes[editIdx].code}
					/>
					<input type="text" name="code" value={data.sizes[editIdx].code} class="hidden" />
				</div>

				<div class="gap-1.5 grid">
					<Label for="name">Name</Label>
					<Input
						name="name"
						required
						id="name"
						class="w-full"
						type="text"
						placeholder="12x12"
						value={data.sizes[editIdx].name}
					/>
				</div>

				<div class="gap-1.5 grid">
					<Label for="width">Width</Label>
					<Input
						name="width"
						required
						id="width"
						class="w-full"
						type="number"
						placeholder="12"
						value={data.sizes[editIdx].width}
					/>
				</div>

				<div class="gap-1.5 grid">
					<Label for="height">Height</Label>
					<Input
						name="height"
						required
						id="height"
						class="w-full"
						type="number"
						placeholder="12"
						value={data.sizes[editIdx].height}
					/>
				</div>

				<div class="gap-1.5 grid">
					<Label for="price">Price (in cents)</Label>
					<Input
						name="price"
						required
						id="price"
						class="w-full"
						type="number"
						placeholder="5999"
						value={data.sizes[editIdx].price}
					/>
				</div>

				<div class="gap-1.5 grid">
					<Label for="stripePriceId">Stripe Price Id</Label>
					<Input
						name="stripePriceId"
						required
						id="stripePriceId"
						class="w-full"
						type="text"
						placeholder="stripe1234..."
						value={data.sizes[editIdx].stripePriceId}
					/>
				</div>

				<div class="gap-1.5 grid">
					<Label for="stripeProductId">Stripe Product Id</Label>
					<Input
						name="stripeProductId"
						required
						id="stripeProductId"
						class="w-full"
						type="text"
						placeholder="stripe1234..."
						value={data.sizes[editIdx].stripeProductId}
					/>
				</div>

				<div class="gap-1.5 grid">
					<Label for="isAvailable">Available</Label>
					<input
						type="checkbox"
						name="isAvailable"
						id="isAvailable"
						checked={data.sizes[editIdx].isAvailable}
					/>
				</div>

				<div class="flex flex-row justify-end">
					<Button type="submit">
						<Edit class="w-4 h-4 mr-2" />
						Update</Button
					>
				</div>
			</form>
		</Sheet.Content>
	</Sheet.Root>
{/if}

