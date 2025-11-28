<script lang="ts">
	import { resolve } from '$app/paths';
	import { page } from '$app/state';
	import { cn } from '$lib/utils';
	import type { DocItem } from 'lovely-docs/doc-cache';

	let { tree, libraryKey }: { tree: DocItem; libraryKey: string } = $props();

	// Helper to check if a node is active
	// We compare the full path.
	// Note: $page.url.pathname might include the base path if deployed, so resolve is important.
	// But here we are constructing the href to compare.
	function isActive(path: string) {
		const target = resolve(`/human/${libraryKey}/${path}`);
		return page.url.pathname === target;
	}
</script>

<nav class="space-y-0.5 text-sm">
	{@render renderNode(tree, '')}
</nav>

{#snippet renderNode(node: DocItem, path: string)}
	{#each Object.entries(node.children) as [key, child]}
		{@const childPath = path ? `${path}/${key}` : key}
		{@const active = isActive(childPath)}
		{@const hasChildren = Object.keys(child.children).length > 0}

		<div class="relative">
			<a
				href={resolve(`/human/${libraryKey}/${childPath}`)}
				class={cn(
					'block truncate rounded-md px-3 py-1.5 transition-colors',
					active
						? 'bg-accent text-accent-foreground font-medium'
						: 'text-muted-foreground hover:text-foreground hover:bg-accent/50'
				)}
				title={child.displayName}>
				{child.displayName}
			</a>

			{#if hasChildren}
				<div class="border-border/40 my-1 ml-3 border-l pl-3">
					{@render renderNode(child, childPath)}
				</div>
			{/if}
		</div>
	{/each}
{/snippet}
