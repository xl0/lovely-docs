<script lang="ts">
	import type { Link, List, ListItem, Paragraph, Text } from 'mdast';
	import { fromMarkdown } from 'mdast-util-from-markdown';
	import { toc, type Result } from 'mdast-util-toc';

	let { markdown, variant = '', hasToc = $bindable(false) }: { markdown: string; variant?: string; hasToc?: boolean } = $props();

	type TocItem = { text: string; id: string; children: TocItem[] };

	// Extract TOC using mdast-util-toc
	let tocItems = $derived.by(() => {
		if (!markdown) return [];
		const tree = fromMarkdown(markdown);
		const result: Result = toc(tree, { maxDepth: 3 });
		if (!result.map) return [];
		return listToItems(result.map);
	});

	// Update hasToc bindable
	$effect(() => {
		hasToc = tocItems.length > 0;
	});

	function listToItems(list: List): TocItem[] {
		return list.children
			.map((li: ListItem) => {
				let text = '',
					id = '';
				const children: TocItem[] = [];
				for (const child of li.children) {
					if (child.type === 'paragraph') {
						const link = (child as Paragraph).children.find((c): c is Link => c.type === 'link');
						if (link) {
							id = (link.url as string).replace(/^#/, '');
							const textNode = link.children.find((c): c is Text => c.type === 'text');
							text = textNode?.value ?? '';
						}
					} else if (child.type === 'list') {
						children.push(...listToItems(child as List));
					}
				}
				return { text, id, children };
			})
			.filter((item) => item.text);
	}

	function scrollToHeading(id: string) {
		// Update URL hash to include variant (variant comes first, then heading id)
		const hash = variant ? `${variant}-${id}` : id;
		history.replaceState(null, '', `#${hash}`);
		const el = document.getElementById(hash);
		if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
	}
</script>

{#if tocItems.length > 0}
	<nav class="border-border ml-1 border-l pl-3 text-sm">
		{@render renderItems(tocItems, 0)}
	</nav>
{/if}

{#snippet renderItems(items: TocItem[], depth: number)}
	{#each items as item}
		<button
			type="button"
			onclick={() => scrollToHeading(item.id)}
			class="text-muted-foreground hover:text-foreground block w-full truncate py-1 text-left transition-colors"
			style="padding-left: {depth * 12}px"
			title={item.text}>
			{item.text}
		</button>
		{#if item.children.length > 0}
			{@render renderItems(item.children, depth + 1)}
		{/if}
	{/each}
{/snippet}
