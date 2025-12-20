<script lang="ts">
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { onMount } from 'svelte';

	const { data } = $props();

	const libraries = $derived(data.mcp?.libraries ?? []);

	onMount(() => {
		if (libraries.length) {
			goto(resolve(`/mcp/tools/get-page/${libraries[0].key}`), { replaceState: true });
		}
	});
</script>
