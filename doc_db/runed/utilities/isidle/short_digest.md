Tracks user idle state based on configurable timeout and monitored events (mousemove, mousedown, resize, keydown, touchstart, wheel by default). Exposes `current` (boolean) and `lastActive` (timestamp) properties.

```ts
const idle = new IsIdle({ timeout: 1000 });
// idle.current - boolean
// idle.lastActive - number (timestamp)
```