## Purpose
`useInterval` is a reactive wrapper around `setInterval` that provides pause/resume controls and automatic tick counting.

## Basic Usage
```svelte
import { useInterval } from "runed";

const interval = useInterval(1000, {
  callback: (count) => console.log(`Tick ${count}`)
});
```

## Core Properties
- `counter` - Tracks the number of ticks that have occurred
- `isActive` - Boolean indicating if the interval is currently running

## Core Methods
- `pause()` - Pauses the interval
- `resume()` - Resumes the interval
- `reset()` - Resets the counter to 0

## Reactive Delay
The delay can be a reactive value (state or derived), and the interval automatically restarts when it changes:
```svelte
let delay = $state(1000);
const interval = useInterval(() => delay);
```

## Options
- `immediate` (default: `true`) - Start the interval immediately
- `immediateCallback` (default: `false`) - Execute callback immediately when resuming
- `callback` - Optional function called on each tick with the current counter value

## Callback Behavior
The callback receives the current counter value on each tick:
```svelte
const interval = useInterval(1000, {
  callback: (count) => console.log(`Tick number ${count}`)
});
```