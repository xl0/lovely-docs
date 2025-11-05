`in:` and `out:` directives apply non-bidirectional transitions. Unlike `transition:`, they play independently—an `in` transition continues while an `out` transition plays, rather than reversing.

```svelte
{#if visible}
  <div in:fly={{ y: 200 }} out:fade>flies in, fades out</div>
{/if}
```