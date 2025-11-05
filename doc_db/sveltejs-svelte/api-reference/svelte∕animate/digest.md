## flip

The `flip` function animates an element between its start and end positions by translating x and y values. FLIP stands for First, Last, Invert, Play.

```js
import { flip } from 'svelte/animate';

function flip(
  node: Element,
  { from, to }: { from: DOMRect; to: DOMRect },
  params?: FlipParams
): AnimationConfig;
```

### AnimationConfig

Configuration object returned by animation functions with properties:
- `delay?: number` - delay before animation starts
- `duration?: number` - animation duration in milliseconds
- `easing?: (t: number) => number` - easing function
- `css?: (t: number, u: number) => string` - CSS animation generator
- `tick?: (t: number, u: number) => void` - callback for each frame

### FlipParams

Parameters for the `flip` function:
- `delay?: number` - delay before animation starts
- `duration?: number | ((len: number) => number)` - duration in ms or function that calculates it based on distance
- `easing?: (t: number) => number` - easing function