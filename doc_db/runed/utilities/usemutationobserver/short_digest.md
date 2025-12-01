Hook to observe DOM element mutations. Pass element reference, callback for mutations, and MutationObserver options. Returns object with `stop()` method to halt observation.

```ts
useMutationObserver(
	() => el,
	(mutations) => { /* handle mutations */ },
	{ attributes: true }
);
```