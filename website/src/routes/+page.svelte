<script lang="ts">
	import { resolve } from '$app/paths';
	import { BookOpen, Bot } from '@lucide/svelte';
	import { Button } from '$lib/components/ui/button';
	import UsageInstructions from '$lib/components/UsageInstructions.svelte';
	import ThemeToggle from '$lib/components/ThemeToggle.svelte';
</script>

<div class="flex flex-col items-center justify-start p-4 space-y-12">
	<div class="absolute top-4 right-4">
		<ThemeToggle />
	</div>
	<div class="text-center space-y-4">
		<h1 class="text-6xl font-bold text-primary">Lovely Docs</h1>
		<p class="text-xl text-muted-foreground">
			Heirarchically optimized documentation for biological and artificial intelligence
		</p>
	</div>

	<div class="flex gap-4 w-full max-w-md">
		<Button href={resolve('/human')} variant="default" size="lg" class="flex-1">
			<BookOpen class="mr-2" size={20} />
			Human View
		</Button>

		<Button href={resolve('/mcp')} variant="outline" size="lg" class="flex-1">
			<Bot class="mr-2" size={20} />
			Agent View
		</Button>
	</div>

	<UsageInstructions />
</div>
