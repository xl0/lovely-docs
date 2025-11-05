The `<svelte:head>` element allows inserting content into `document.head`. During server-side rendering, head content is exposed separately from body content.

This element may only appear at the top level of a component and cannot be nested inside blocks or other elements.

```svelte
<svelte:head>
	<title>Hello world!</title>
	<meta name="description" content="This is where the description goes for SEO" />
</svelte:head>
```