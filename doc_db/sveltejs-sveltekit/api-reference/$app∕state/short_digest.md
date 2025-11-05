## $app/state

Three read-only state objects:

**navigating**: In-progress navigation with `from`, `to`, `type`, `delta` properties; `null` when idle.

**page**: Current page info including `data`, `form`, `state`, `url`, `route`, `params`, `error`. Use runes for reactivity:
```svelte
const id = $derived(page.params.id); // Correct
$: badId = page.params.id; // Won't update
```

**updated**: Boolean `current` property and `check()` method. Reflects new app versions when polling enabled.