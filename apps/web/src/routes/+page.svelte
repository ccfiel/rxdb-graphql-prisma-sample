<script lang="ts">
	import { onMount } from 'svelte';
	import { MyCounterButton } from 'ui';
	import { createDb } from '$lib/rxdb/rxdb';
	import { replication } from '$lib/rxdb/graphqlReplication';
	import { pullHeroQueryBuilder, pushHeroQueryBuilder } from '$lib/rxdb/heroQueryBuilder';
	import Pagination from './Pagination.svelte';
	import { totalPages } from '$lib/stores/pageStores';
	import { v4 as uuidv4 } from 'uuid';

	let rxdb: any;
	let limitPage = 10;
	let totalHeroes: number = 0;

	$: currentPage = 1;
	$: heroesList = [] as any;
	$: loading = false;
	$: form = {
		name: '',
		color: '',
		updatedAt: new Date().toISOString(),
		createdAt: new Date().toISOString()
	} as { name: string; color: string; updatedAt: string; createdAt: string; id?: string };

	onMount(async () => {
		rxdb = await createDb();
		const heroReplication = await replication(
			rxdb.heroes,
			pullHeroQueryBuilder,
			pushHeroQueryBuilder
		);
		heroReplication?.error$.subscribe((error) => {
			console.log('Replication error', error);
		});

		// const customerQuery = rxdb.heroes.find();
		// customerQuery.$.subscribe((results: any[]) => {
		// 	heroesList = results.map((r) => {
		// 		return r.toJSON();
		// 	});
		// });
		const totalLength = rxdb.heroes.find();
		totalLength.$.subscribe((results: any[]) => {
			const transaction = results.map((r) => {
				return r.toJSON();
			});
			totalHeroes = transaction.length;
			totalPages.set(Math.ceil(totalHeroes / limitPage));
		});

		getList(limitPage, 0);
	});

	const getList = (limit: number, skip: number) => {
		if (rxdb) {
			const query = rxdb.heroes.find({
				sort: [{ updatedAt: 'desc' }],
				skip: skip,
				limit: limit
			});
			query.$.subscribe((results: any[]) => {
				heroesList = results.map((r) => {
					return r.toJSON();
				});
			});
		}
	};
	const onPageChange = async (page: any) => {
		loading = true;
		currentPage = page;

		getList(limitPage, (page - 1) * limitPage);
		loading = false;
	};
	const save = async () => {
		if (form.name === '' || form.color === '') {
			alert('Please Input name and color');
		} else if (form.id) {
			form.updatedAt = new Date().toISOString();
			const doc = await rxdb.heroes.upsert(form);
			console.log('update', doc);
		} else {
			let myuuid = uuidv4();
			form.id = myuuid;
			form.updatedAt = new Date().toISOString();
			form.createdAt = new Date().toISOString();
			console.log('insert', form);

			const doc = await rxdb.heroes.upsert(form);
			console.log(doc);
			// rxdb.heroes.insert(())
		}
		form = {
			name: '',
			color: '',
			updatedAt: new Date().toISOString(),
			createdAt: new Date().toISOString()
		};
	};
	const update = () => {
		// rxdb.heroes.insert(())
		console.log(form);
		form = {
			name: '',
			color: '',
			updatedAt: new Date().toISOString(),
			createdAt: new Date().toISOString()
		};
	};
	const view = (hero: any) => {
		form = { ...hero };
	};
	const deleteHero = async (e: any, id: any) => {
		e.stopPropagation();
		console.log(id);
		const query = rxdb.heroes.find({
			selector: {
				id: id
			}
		});
		// Remove the documents from the collection
		const removedDocs = await query.remove();
		console.log(removedDocs)
	};
</script>

<main class="m-4">
	<div>
		<h1 class="text-2xl font-medium">Form</h1>
		<div class="relative overflow-x-auto border rounded-xl py-4 px-10 w-3/6">
			{#if form?.id}
				<p class="text-xs">ID: {form.id}</p>
			{/if}
			<div class="w-full">
				<label class="label" for="or_number">
					<span class="text-sm">Hero Name</span>
				</label>
				<input
					bind:value={form.name}
					name="or_number"
					type="text"
					class="inputClass input input-sm rounded border-2 border-gray-200 bg-gray-50 w-full"
				/>
			</div>
			<div class="w-full">
				<label class="label" for="or_number">
					<span class="text-sm">Hero Color</span>
				</label>
				<input
					bind:value={form.color}
					name="or_number"
					type="text"
					class="inputClass input input-sm rounded border-2 border-gray-200 bg-gray-50 w-full"
				/>
			</div>
			<div class="w-full flex justify-end">
				{#if form?.id}
					<button on:click={save} class="mt-2 p-2 bg-green-600 rounded-md text-white font-semibold"
						>Update</button
					>
				{:else}
					<button on:click={save} class="mt-2 p-2 bg-blue-600 rounded-md text-white font-semibold"
						>Save</button
					>
				{/if}
			</div>
		</div>
	</div>
	<div>
		<div>
			<h1 class="text-2xl font-medium">Hero Lists</h1>
		</div>
		<div class="relative overflow-x-auto w-full border rounded-xl p-4">
			<table class="w-full text-sm text-left text-gray-500 dark:text-gray-400">
				<thead class="text-xs text-gray-700">
					<tr>
						<th />
						<th scope="col" class="px-6 py-3"> Name</th>
						<th scope="col" class="px-6 py-3"> Color</th>
						<th scope="col" class="px-6 py-3"> Updated At</th>
						<th scope="col" class="px-6 py-3"> Created At</th>
					</tr>
				</thead>
				<tbody>
					<!-- {#if loading}
						<tr class="bg-white border-b dark:bg-gray-800 hover:bg-blue-50 cursor-pointer">
							<td colspan="6" class="px-6 py-4 text-center"> Loading data... </td>
						</tr> -->
					{#if !heroesList || heroesList.length === 0}
						<tr class="bg-white border-b hover:bg-blue-50 cursor-pointer">
							<td colspan="6" class="px-6 py-4 text-center"> No data found </td>
						</tr>
					{:else}
						{#each heroesList as hero, index}
							<tr
								on:click={() => {
									view(hero);
								}}
								class="bg-white border-b hover:bg-blue-50 cursor-pointer"
							>
								<td>{index + 1}</td>
								<th scope="row" class="px-6 py-2 font-medium text-gray-900 whitespace-nowrap">
									{hero.name}
								</th>
								<td class="px-6 py-2 text-gray-900"> {hero.color}</td>
								<td class="px-6 py-2 text-gray-900"> {hero.updatedAt}</td>
								<td class="px-6 py-2 text-gray-900">{hero.createdAt}</td>
								<td class="px-6 py-2 text-gray-900">
									<button
										on:click={(e) => {
											deleteHero(e, hero.id);
										}}
										class="bg-red-600 rounded p-1 text-white"
									>
										Delete
									</button>
								</td>
							</tr>
						{/each}
					{/if}
				</tbody>
			</table>
		</div>
		<nav class="flex justify-end mt-4">
			<Pagination {currentPage} {onPageChange} />
		</nav>
	</div>
</main>
