## Creating Components

```ts
const app = new App({
	target: document.body,
	props: { answer: 42 },
	hydrate: false,
	intro: false
});
```

## Methods

- `$set(props)` - Update props asynchronously
- `$on(event, callback)` - Listen to events
- `$destroy()` - Remove component

## Props Access

With `accessors: true`, props are synchronous getters/setters:
```ts
component.count += 1;
```

## Server-side Rendering

```ts
const { head, html, css } = App.render({ answer: 42 });
```

**Svelte 3/4 API** — Svelte 5 uses `mount()`, `unmount()`, and `$state`.