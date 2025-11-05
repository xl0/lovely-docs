The `svelte/easing` module exports 33 easing functions for animations: `linear`, polynomial curves (`quad`, `cubic`, `quart`, `quint`), trigonometric (`sine`, `expo`, `circ`), and specialized (`back`, `elastic`, `bounce`). Each has `In`, `Out`, and `InOut` variants. Functions accept normalized time `t` and return eased values.

```js
import { cubicInOut, bounceOut } from 'svelte/easing';
```