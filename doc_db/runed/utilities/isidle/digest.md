## IsIdle

Tracks user activity and determines if they're idle based on a configurable timeout. Monitors mouse movement, keyboard input, and touch events to detect user interaction.

### Constructor Options

```ts
interface IsIdleOptions {
  events?: MaybeGetter<(keyof WindowEventMap)[]>;
  // Default: ['mousemove', 'mousedown', 'resize', 'keydown', 'touchstart', 'wheel']
  
  timeout?: MaybeGetter<number>;
  // Timeout in milliseconds before idle state is set to true. Default: 60000 (60 seconds)
  
  detectVisibilityChanges?: MaybeGetter<boolean>;
  // Detect document visibility changes. Default: false
  
  initialState?: boolean;
  // Initial state of the idle property. Default: false
}
```

### API

```ts
class IsIdle {
  constructor(options?: IsIdleOptions);
  readonly current: boolean;        // Current idle state
  readonly lastActive: number;      // Timestamp of last user activity
}
```

### Usage Example

```svelte
<script lang="ts">
  import { IsIdle } from "runed";
  
  const idle = new IsIdle({ timeout: 1000 });
</script>

<p>Idle: {idle.current}</p>
<p>Last active: {new Date(idle.lastActive).toLocaleTimeString()}</p>
```

Customizable events trigger activity detection. By default monitors mousemove, mousedown, resize, keydown, touchstart, and wheel events. The `lastActive` property stores the timestamp of the most recent user interaction.