## Spring & Tween Classes

Animate values with spring physics or tweening:

```js
import { Spring, Tween } from 'svelte/motion';
const spring = new Spring(0);
const tween = new Tween(0);
spring.target = 100; // animates current to target
```

Both have `set(value, options)` methods returning promises and `Spring.of()`/`Tween.of()` for reactive binding.

## prefersReducedMotion

Media query for accessibility:
```js
transition:fly={{ y: prefersReducedMotion.current ? 0 : 200 }}
```

Deprecated: `spring()` and `tweened()` functions replaced by classes.