<script lang="ts">
	import classList from 'hast-util-class-list';
	import { isElement } from 'hast-util-is-element';
	import rehypeExternalLinks from 'rehype-external-links';
	import rehypeHighlight from 'rehype-highlight';
	import rehypeSlug from 'rehype-slug';
	import rehypeStringify from 'rehype-stringify';
	import remarkBreaks from 'remark-breaks';
	import remarkGfm from 'remark-gfm';
	import remarkParse from 'remark-parse';
	import remarkRehype from 'remark-rehype';
	import { common } from 'lowlight';
	import { unified } from 'unified';
	import type { Element, Root } from 'hast';
	import { h, s } from 'hastscript';
	import { toString } from 'hast-util-to-string';

	let { content = '', variant = '' }: { content: string; variant?: string } = $props();

	// SVG paths for copy and check icons
	const copyIconPaths = [
		s('rect', { width: '14', height: '14', x: '8', y: '8', rx: '2', ry: '2' }),
		s('path', { d: 'M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2' })
	];

	function createCopyButton(): Element {
		const svg = s(
			'svg',
			{
				xmlns: 'http://www.w3.org/2000/svg',
				viewBox: '0 0 24 24',
				fill: 'none',
				stroke: 'currentColor',
				'stroke-width': '2',
				'stroke-linecap': 'round',
				'stroke-linejoin': 'round',
				class: 'copy-icon w-4 h-4'
			},
			copyIconPaths.map((p) => ({ ...p, properties: { ...p.properties } }))
		);

		return h(
			'button',
			{
				className: [
					'copy-code-btn',
					'absolute',
					'top-2',
					'right-2',
					'p-1.5',
					'rounded',
					'hover:bg-muted/50',
					'text-muted-foreground/50',
					'hover:text-foreground',
					'transition-colors',
					'opacity-10',
					'group-hover:opacity-100'
				],
				title: 'Copy to clipboard',
				type: 'button'
			},
			[svg]
		);
	}

	function wrapCodeBlockWithCopyButton(node: Element): void {
		if (node.tagName !== 'pre') return;
		if (node.children.length !== 1) return;
		const codeChild = node.children[0];
		if (!isElement(codeChild, 'code')) return;

		// Wrap pre in a relative container with the copy button
		const copyButton = createCopyButton();
		const wrapper = h('div', { className: ['relative', 'group', 'my-4'] }, [
			{ ...node, properties: { ...node.properties, className: [...((node.properties.className as string[]) || []), 'pr-10'] } },
			copyButton
		]);

		// Replace node contents with wrapper contents
		node.tagName = 'div';
		node.properties = wrapper.properties;
		node.children = wrapper.children;
	}

	function createRehypeApplyMods(currentVariant: string) {
		return function (tree: Root) {
			let preWithCode: Element[] = [];

			function visit(node: any) {
				if (node.type === 'element') {
					// Add copy buttons to code blocks
					if (isElement(node, 'pre') && node.children.length === 1 && isElement(node.children[0], 'code')) {
						preWithCode.push(node);
					}
					// Prefix heading IDs with variant
					if (currentVariant && isElement(node, ['h1', 'h2', 'h3', 'h4', 'h5', 'h6']) && node.properties?.id) {
						node.properties.id = `${currentVariant}-${node.properties.id}`;
					}
				}
				// Recurse into children for all node types (root, element, etc.)
				if (node.children) {
					node.children.forEach(visit);
				}
			}

			visit(tree);
			preWithCode.forEach(wrapCodeBlockWithCopyButton);
		};
	}

	let markdownHtml = $state('');

	$effect(() => {
		const res = unified()
			.use(remarkParse)
			.use(remarkBreaks)
			.use(remarkGfm)
			.use(remarkRehype, { allowDangerousHtml: true })
			.use(rehypeSlug)
			.use(createRehypeApplyMods, variant)
			.use(rehypeHighlight, { detect: true, languages: { ...common }, aliases: { typescript: ['ts', 'svelte'] } })
			.use(rehypeExternalLinks, { target: '_blank' })
			.use(rehypeStringify)
			.processSync(content);

		markdownHtml = res.toString();
	});

	// Handle copy button clicks via event delegation
	function handleClick(e: MouseEvent) {
		const btn = (e.target as HTMLElement).closest('.copy-code-btn') as HTMLButtonElement | null;
		if (!btn) return;
		const wrapper = btn.closest('.group');
		const pre = wrapper?.querySelector('pre');
		if (pre) {
			const text = pre.textContent ?? '';
			navigator.clipboard.writeText(text.trim());

			// Show checkmark feedback
			const svg = btn.querySelector('svg');
			if (svg) {
				const originalHTML = svg.innerHTML;
				svg.innerHTML = '<polyline points="20 6 9 17 4 12"></polyline>';
				btn.classList.add('opacity-100');
				setTimeout(() => {
					svg.innerHTML = originalHTML;
					btn.classList.remove('opacity-100');
				}, 2000);
			}
		}
	}
</script>

<!-- svelte-ignore a11y_click_events_have_key_events a11y_no_static_element_interactions -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
<div class="prose prose-slate dark:prose-invert max-w-none" onclick={handleClick}>
	{@html markdownHtml}
</div>
