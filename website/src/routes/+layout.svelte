<script lang="ts">
	import { resolve } from '$app/paths';
	import { ModeWatcher, mode } from 'mode-watcher';
	import '../app.css';
	import posthog from 'posthog-js';
	import { browser } from '$app/environment';
	import { onMount } from 'svelte';
	import { page } from '$app/state';
	import { env } from '$env/dynamic/public';

	$effect(() => {
		if (mode.current === 'light') {
			import('highlight.js/styles/github.min.css');
		} else {
			import('highlight.js/styles/github-dark.min.css');
		}
	});

	onMount(() => {
		if (browser && env.PUBLIC_POSTHOG_KEY) {
			posthog.init(env.PUBLIC_POSTHOG_KEY, {
				api_host: env.PUBLIC_POSTHOG_HOST || 'https://us.i.posthog.com',
				capture_pageview: false,
				capture_pageleave: true
			});
		}
	});

	$effect(() => {
		if (browser && page.url) {
			posthog.capture('$pageview');
		}
	});

	let { children } = $props();
</script>

<ModeWatcher />
{@render children()}

<div class="hidden" aria-hidden="true">
	<a href={resolve('/human')}>human-index</a>
</div>
