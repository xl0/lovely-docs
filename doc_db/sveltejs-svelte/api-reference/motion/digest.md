## Spring

A class wrapper for values that animate with spring physics. Changes to `spring.target` cause `spring.current` to move towards it over time based on `stiffness` and `damping` parameters.

```js
import { Spring } from 'svelte/motion';
const spring = new Spring(0);
spring.target = 100; // current animates to 100
```

Methods:
- `set(value, options)` - Sets target and returns promise when current catches up. Options: `instant` (immediate), `preserveMomentum` (milliseconds for fling gestures)
- `Spring.of(fn, options)` - Creates spring bound to function return value, must be called in effect root

Properties: `target`, `current`, `stiffness`, `damping`, `precision`

## Tween

A class wrapper for values that smoothly tween to target. Changes to `tween.target` cause `tween.current` to move towards it based on `delay`, `duration`, and `easing` options.

```js
import { Tween } from 'svelte/motion';
const tween = new Tween(0);
tween.target = 100; // current animates to 100
```

Methods:
- `set(value, options)` - Sets target and returns promise when current catches up. Options override defaults
- `Tween.of(fn, options)` - Creates tween bound to function return value, must be called in effect root

Properties: `target`, `current`

## prefersReducedMotion

A media query that matches the user's prefers-reduced-motion setting. Use to conditionally disable animations for accessibility.

```js
import { prefersReducedMotion } from 'svelte/motion';
import { fly } from 'svelte/transition';

{#if visible}
  <p transition:fly={{ y: prefersReducedMotion.current ? 0 : 200 }}>
    flies in, unless user prefers reduced motion
  </p>
{/if}
```

## Legacy APIs

`spring()` and `tweened()` functions are deprecated - use `Spring` and `Tween` classes instead. Legacy stores extend `Readable` with `subscribe()` and `update()` methods.