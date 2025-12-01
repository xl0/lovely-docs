## IsMounted

Utility class that tracks component mount state via a `current` property (false initially, true after mount).

```svelte
import { IsMounted } from "runed";
const isMounted = new IsMounted();
```

Equivalent to using `onMount` or `$effect` with `untrack` to set a state value to true after mounting.