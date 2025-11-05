## render

Server-side function for rendering Svelte components to HTML strings.

```js
import { render } from 'svelte/server';

const { body, head } = render(Component, {
  props: { /* ... */ },
  context: new Map(),
  idPrefix: 'prefix-'
});
```

Returns object with `body` (component HTML) and `head` (svelte:head content).