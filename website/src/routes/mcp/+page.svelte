<!-- <script lang="ts">
	import { page } from '$app/state';
	import { goto } from '$app/navigation';
	import type { PageData } from './$types';

	const { data } = $props<{ data: PageData }>();
	const libraries = $derived(data.libraries);
	const mcp = $derived(data.mcp);

	type MarkdownVariant = PageData['mcp']['markdownVariantKeys'][number];

	const searchParams = $derived(page.url.searchParams);
	const selectedLibrary = $derived(searchParams.get('library') ?? libraries[0]?.key ?? '');
	const op = $derived(searchParams.get('op') ?? 'getNodeMarkdown');
	const path = $derived(searchParams.get('path') ?? '');
	const level = $derived((searchParams.get('level') ?? 'digest') as MarkdownVariant);

	const request = $derived(mcp.request);
	const result = $derived(mcp.result);
	const error = $derived(mcp.error);
	const markdownVariants = $derived(mcp.markdownVariantKeys);

	function updateUrl(params: Record<string, string | undefined>) {
		const next = new URLSearchParams(searchParams);
		Object.entries(params).forEach(([key, value]) => {
			if (value === undefined || value === '') next.delete(key);
			else next.set(key, value);
		});
		goto(`?${next.toString()}`, { replaceState: true, noScroll: true });
	}
</script>

<div class="container mx-auto px-4 py-8 max-w-6xl space-y-6">
	<h1 class="text-3xl font-bold tracking-tight">MCP-style playground</h1>
	<p class="text-sm text-muted-foreground max-w-2xl">
		Interact with the documentation using the same helpers that back the MCP server – no client required. Use the URL to
		describe the call, similar to how an MCP client would.
	</p>

	<div class="grid grid-cols-1 md:grid-cols-2 gap-6 items-start border rounded-lg p-4 bg-background/60">
		<div class="space-y-4">
			<div class="space-y-1">
				<label for="library-select" class="block text-sm font-medium">Library</label>
				<select
					id="library-select"
					class="w-full border rounded px-2 py-1 bg-background text-sm"
					value={selectedLibrary}
					onchange={(e) => updateUrl({ library: (e.target as HTMLSelectElement).value })}>
					{#each libraries as lib}
						<option value={lib.key} selected={lib.key === selectedLibrary}>
							{lib.key} – {lib.summary.name}
						</option>
					{/each}
				</select>
			</div>

			<div class="space-y-1">
				<label for="op-select" class="block text-sm font-medium">Operation</label>
				<select
					id="op-select"
					class="w-full border rounded px-2 py-1 bg-background text-sm"
					value={op}
					onchange={(e) =>
						updateUrl({ op: (e.target as HTMLSelectElement).value, library: selectedLibrary, path, level })}>
					<option value="getNodeMarkdown">getNodeMarkdown</option>
					<option value="getRelevantEssenceSubTree">getRelevantEssenceSubTree</option>
				</select>
			</div>

			<div class="space-y-1">
				<label for="path-input" class="block text-sm font-medium">Path (optional)</label>
				<input
					id="path-input"
					value={path}
					placeholder="e.g. api/Client/connect"
					class="w-full border rounded px-2 py-1 bg-background text-sm"
					oninput={(e) =>
						updateUrl({ path: (e.target as HTMLInputElement).value, library: selectedLibrary, op, level })} />
				<p class="text-xs text-muted-foreground">Matches the internal doc tree paths used by the MCP server.</p>
			</div>

			{#if op === 'getNodeMarkdown'}
				<div class="space-y-1">
					<label for="level-select" class="block text-sm font-medium">Markdown level</label>
					<select
						id="level-select"
						class="bg-black text-green-400 border border-green-700 text-xs px-1 py-0.5 w-full"
						value={level}
						onchange={(e) =>
							updateUrl({ level: (e.target as HTMLSelectElement).value, library: selectedLibrary, op, path })}>
						{#each markdownVariants as k}
							<option value={k}>{k}</option>
						{/each}
					</select>
				</div>
			{/if}

			{#if error}
				<p class="text-xs text-destructive mt-1">{error}</p>
			{/if}
		</div>

		<div class="space-y-4">
			<div class="border rounded-md p-3 bg-muted/40">
				<h2 class="text-sm font-semibold mb-2">Request</h2>
				<pre class="text-xs overflow-x-auto whitespace-pre-wrap">
{JSON.stringify(request, null, 2)}
				</pre>
			</div>

			<div class="border rounded-md p-3 bg-muted/40 min-h-32">
				<h2 class="text-sm font-semibold mb-2">Response</h2>
				{#if result === null || result === undefined}
					<p class="text-xs text-muted-foreground">No result.</p>
				{:else if op === 'getNodeMarkdown' && typeof result === 'string'}
					<pre class="text-xs overflow-x-auto whitespace-pre-wrap">{result}</pre>
				{:else}
					<pre class="text-xs overflow-x-auto whitespace-pre-wrap">{JSON.stringify(result, null, 2)}</pre>
				{/if}
			</div>
		</div>
	</div>
</div> -->
