<script>
	import { totalPages } from '$lib/stores/pageStores';

	/**
	 * @type {number}
	 */
	export let currentPage;

	/**
	 * @type {any}
	 */

	/**
	 * @type {(arg0: any) => void}
	 */
	export let onPageChange;

	const limit = 5; // Maximum number of pages to display
	$: pages = Array.from({ length: $totalPages }, (_, i) => i + 1); // Array of all pages
	$: index = pages.indexOf(currentPage); // Index of the current page in the array
	$: startPage = Math.max(index - Math.floor(limit / 2), 0); // Starting index for displayed pages
	$: endPage = Math.min(startPage + limit, $totalPages); // Ending index for displayed pages
	$: displayedPages = pages.slice(startPage, endPage); // Array of displayed pages
</script>

<div class="pagination">
	{#if startPage > 1}
		<button
			class="px-3 py-2 ml-0 leading-tight bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700"
			on:click={() => onPageChange(1)}>1</button
		>
		{#if startPage > 2}
			<span>...</span>
		{/if}
	{/if}

	{#each displayedPages as page}
		<button
			class={`px-3 py-2 ml-0 leading-tight 
        ${
					currentPage === page
						? 'text-blue-600 border border-gray-300 bg-blue-50 hover:bg-blue-100 hover:text-blue-700'
						: 'bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700'
				}`}
			on:click={() => onPageChange(page)}
		>
			{page}
		</button>
	{/each}
	<!-- </ul> -->
	<!-- 
	{#if endPage < totalPages}
		{#if endPage < totalPages - 1}
			<span>...</span>
		{/if}
		<button class="btn btn-sm btn-primary" on:click={() => onPageChange(totalPages)}>{totalPages}</button>
	{/if} -->

	<!-- {#each Array.from({ length: endPage - startPage + 1 }, (_, i) => i + startPage) as page}
		<button class={`btn btn-sm btn-primary ${currentPage=== page? 'btn-accent': ''}`} class:active={currentPage === page} on:click={() => onPageChange(page)}>
			{page}
		</button>
	{/each}

	{#if endPage < totalPages}
		{#if endPage < totalPages - 1}
			<span>...</span>
		{/if}
		<button class="btn btn-sm btn-primary" on:click={() => onPageChange(totalPages)}>{totalPages}</button>
	{/if} -->
</div>
