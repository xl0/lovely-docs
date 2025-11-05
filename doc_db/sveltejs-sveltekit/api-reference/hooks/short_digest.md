## sequence

Chains multiple `handle` middleware with specific ordering:
- `transformPageChunk`: reverse order, merged
- `preload`: forward order, first wins
- `filterSerializedResponseHeaders`: forward order, first wins

```js
import { sequence } from '@sveltejs/kit/hooks';
export const handle = sequence(first, second);
```