The `svelte/easing` module provides a collection of easing functions for animations and transitions. These functions take a value between 0 and 1 (representing progress through an animation) and return an eased value, allowing you to create smooth, natural-looking motion effects.

Common easing functions include:
- Linear: constant speed
- Quadratic, Cubic, Quartic, Quintic: polynomial easing with varying intensity
- Sine, Exponential, Circular: smooth curves with different characteristics
- Elastic, Back, Bounce: specialized effects for springy or bouncy animations

Each easing function typically has `In`, `Out`, and `InOut` variants that control whether the easing is applied at the start, end, or both ends of the animation.

Example usage in a transition:
```javascript
import { quintOut } from 'svelte/easing';
transition:fade={{ duration: 400, easing: quintOut }}
```