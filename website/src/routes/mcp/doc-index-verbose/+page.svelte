<script lang="ts">
	import { page } from '$app/state';
	import { resolve } from '$app/paths';

	const { data } = $props();

	const ecosystem = $derived(page.url.hash.slice(1));
	const activeResource = $derived(data.mcp.resources.find((r) => r.label === page.url.hash.slice(1) || !ecosystem));
</script>

{#if activeResource}
	<div class="font-mono text-sm">
		{#each Object.entries(activeResource.verbose) as [lib, summary]}
			<a
				href={resolve(`/mcp/page-index/${lib}`)}
				class="block w-full text-left text-primary hover:text-primary/80 hover:bg-accent transition-colors">
				{lib}<span class="text-muted-foreground">: {summary}</span>
			</a>
		{/each}
	</div>
{:else}
	<p class="text-xs text-muted-foreground"># no resources for ecosystem {ecosystem ?? '*'}</p>
{/if}
