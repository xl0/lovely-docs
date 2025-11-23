<script lang="ts">
	import classList from 'hast-util-class-list';
	import { isElement } from 'hast-util-is-element';
	import rehypeExternalLinks from 'rehype-external-links';
	import rehypeHighlight from 'rehype-highlight';
	import rehypeStringify from 'rehype-stringify';
	import remarkBreaks from 'remark-breaks';
	import remarkGfm from 'remark-gfm';
	import remarkParse from 'remark-parse';
	import remarkRehype from 'remark-rehype';
	import { common } from 'lowlight';
	import { unified } from 'unified';
	import type { Element, Root } from 'hast';
	import { h, s } from 'hastscript';

	let { content = '' }: { content: string } = $props();

	// SVG for copy icon (converted from lucide)
	const copySVG = s(
		'svg',
		{
			xmlns: 'http://www.w3.org/2000/svg',
			viewBox: '0 0 24 24',
			fill: 'none',
			stroke: 'currentColor',
			'stroke-width': '2',
			'stroke-linecap': 'round',
			'stroke-linejoin': 'round',
			class: 'w-4 h-4'
		},
		[
			s('rect', { width: '14', height: '14', x: '8', y: '8', rx: '2', ry: '2' }),
			s('path', { d: 'M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2' })
		]
	);

	function nodeCopyButton(node: Element): Element | Element[] {
		if (node.tagName !== 'pre') return node;
		if (node.children.length !== 1) return node;

		const child = node.children[0] as Element;
		if (child.tagName !== 'code') return node;

		const cl = classList(child);
		let language = 'text';

		cl.forEach((c: string) => {
			if (c.startsWith('language-')) {
				language = c.slice(9);
			}
		});

		const copyButton: Element = h(
			'button',
			{
				className: [
					'inline-flex',
					'items-center',
					'justify-center',
					'rounded-md',
					'text-sm',
					'font-medium',
					'transition-colors',
					'hover:bg-accent',
					'hover:text-accent-foreground',
					'h-8',
					'w-8',
					'p-0'
				],
				title: 'Copy to clipboard',
				type: 'button',
				onClick: `
					const preElement = this.parentElement.nextElementSibling;
					if (preElement) {
						const text = preElement.childNodes[0].textContent;
						navigator.clipboard.writeText(text.trim());
					}`
			},
			[copySVG]
		);

		const header = h(
			'div',
			{
				className: [
					'flex',
					'justify-between',
					'items-center',
					'bg-muted',
					'px-4',
					'py-2',
					'rounded-t-lg',
					'border',
					'border-b-0'
				]
			},
			[h('span', { class: 'text-xs text-muted-foreground font-mono' }, language), copyButton]
		);

		const childCopy = { ...child };
		childCopy.properties = {
			...childCopy.properties,
			style: undefined
		};

		const newPreWithCode = h('pre', { className: ['whitespace-pre-wrap', 'm-0', 'rounded-t-none'] }, [childCopy]);

		child.tagName = 'div';
		child.children = [header, newPreWithCode];

		node.tagName = 'div';
		node.properties.className = ['rounded-lg', 'my-4', 'overflow-hidden'];

		return newPreWithCode;
	}

	function rehypeApplyMods() {
		return function (tree: Root) {
			let preWithCode: Element[] = [];

			// Find all pre elements with code children
			function visit(node: any) {
				if (node.type === 'element') {
					if (isElement(node, 'pre') && node.children.length === 1 && isElement(node.children[0], 'code')) {
						preWithCode.push(node);
					}
					if (node.children) {
						node.children.forEach(visit);
					}
				}
			}

			visit(tree);
			preWithCode = preWithCode.flatMap(nodeCopyButton);
		};
	}

	let markdownHtml = $state('');

	$effect(() => {
		const res = unified()
			.use(remarkParse)
			.use(remarkBreaks)
			.use(remarkGfm)
			.use(remarkRehype, { allowDangerousHtml: true })
			.use(rehypeApplyMods)
			.use(rehypeHighlight, { detect: true, languages: { ...common }, aliases: { typescript: ['ts', 'svelte'] } })
			.use(rehypeExternalLinks, { target: '_blank' })
			.use(rehypeStringify)
			.processSync(content);

		markdownHtml = res.toString();
	});
</script>

<div class="prose prose-slate dark:prose-invert max-w-none">
	{@html markdownHtml}
</div>