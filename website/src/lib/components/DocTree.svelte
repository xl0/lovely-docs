<script lang="ts">
	import { resolve } from '$app/paths';
	import { FileText, FolderOpen } from '@lucide/svelte';
	import type { DocItem } from 'lovely-docs-mcp/doc-cache';

	let { node, libraryKey, basePath = '' }: { node: DocItem; libraryKey: string; basePath?: string } = $props();

	function buildPath(base: string, key: string): string {
		return base ? `${base}${key}` : key;
	}

	function buildHref(base: string, key: string): string {
		return resolve(`/${libraryKey}/${buildPath(base, key)}`);
	}
</script>

{#snippet renderTree(node: DocItem, base: string, depth: number = 0)}
	{#each Object.entries(node.children) as [k, child]}
		<div class="relative">
			<a href={buildHref(base, k)} class="block group">
				<div
					class="flex items-center justify-between py-1 px-3 rounded-md hover:bg-accent/50 transition-all duration-150 border border-transparent hover:border-accent {!child.relevant
						? 'opacity-50'
						: ''}"
					style="margin-left: {depth * 1.25}rem">
					<div class="flex items-center gap-1 flex-1 min-w-0">
						{#if depth > 0}
							<div class="flex items-center text-muted-foreground/40">
								<svg width="20" height="20" viewBox="0 0 20 20" class="shrink-0">
									<path
										d="M 5 0 L 5 10 L 15 10"
										stroke="currentColor"
										stroke-width="1.5"
										fill="none"
										stroke-linecap="round" />
								</svg>
							</div>
						{/if}
						<div class="flex items-center gap-2 shrink-0">
							{#if Object.keys(child.children).length > 0}
								<FolderOpen class="h-4 w-4 {child.relevant ? 'text-blue-500' : 'text-muted-foreground'}" />
							{:else}
								<FileText class="h-4 w-4 {child.relevant ? 'text-foreground' : 'text-muted-foreground'}" />
							{/if}
						</div>
						<span class="font-mono text-sm truncate group-hover:text-foreground transition-colors"
							>{child.displayName}</span>
					</div>
				</div>
			</a>
			{#if Object.keys(child.children).length}
				{@render renderTree(child, buildPath(base, k) + '/', depth + 1)}
			{/if}
		</div>
	{/each}
{/snippet}

{@render renderTree(node, basePath)}
