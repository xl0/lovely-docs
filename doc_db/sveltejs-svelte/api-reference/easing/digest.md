The `svelte/easing` module provides a collection of easing functions for animations and transitions. Available functions include:

**Basic easing curves:**
- `linear` - constant rate of change
- `quadIn`, `quadOut`, `quadInOut` - quadratic easing
- `cubicIn`, `cubicOut`, `cubicInOut` - cubic easing
- `quartIn`, `quartOut`, `quartInOut` - quartic easing
- `quintIn`, `quintOut`, `quintInOut` - quintic easing

**Specialized easing curves:**
- `sineIn`, `sineOut`, `sineInOut` - sine-based easing
- `expoIn`, `expoOut`, `expoInOut` - exponential easing
- `circIn`, `circOut`, `circInOut` - circular easing
- `backIn`, `backOut`, `backInOut` - back easing with overshoot
- `elasticIn`, `elasticOut`, `elasticInOut` - elastic easing with oscillation
- `bounceIn`, `bounceOut`, `bounceInOut` - bounce easing

Each function accepts a normalized time value `t` (typically 0 to 1) and returns the eased value. The naming convention uses suffixes: `In` for easing in, `Out` for easing out, and `InOut` for easing both in and out.

Import example:
```js
import { cubicInOut, bounceOut } from 'svelte/easing';
```