## $lib Import Alias

SvelteKit automatically makes files under `src/lib` available using the `$lib` import alias.

The alias can be customized to point to a different directory via the config file (see configuration#files).

### Example

```svelte
<!--- file: src/lib/Component.svelte --->
A reusable component
```

```svelte
<!--- file: src/routes/+page.svelte --->
<script>
    import Component from '$lib/Component.svelte';
</script>

<Component />
```