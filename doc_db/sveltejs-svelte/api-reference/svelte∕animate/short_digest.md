## flip

Animates element position changes using the FLIP technique (First, Last, Invert, Play).

```js
import { flip } from 'svelte/animate';

flip(node, { from: DOMRect, to: DOMRect }, params?: FlipParams): AnimationConfig
```

Configure with `delay`, `duration` (number or function), and `easing`.