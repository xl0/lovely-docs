Strongly-typed finite state machine for managing discrete states and event-driven transitions.

**Basic setup:**
```ts
const f = new FiniteStateMachine<MyStates, MyEvents>("off", {
	off: { toggle: "on" },
	on: { toggle: "off" }
});
f.send("toggle");
```

**Actions** (conditional transitions):
```ts
toggle: (heldMillis: number) => {
	if (heldMillis > 3000) return "off";
}
```

**Lifecycle methods** (`_enter`, `_exit`):
```ts
_enter: (meta) => console.log(meta.from, meta.to, meta.event)
```

**Wildcard state** (`*`): fallback handler for unhandled events.

**Debouncing**: `f.debounce(5000, "toggle")` schedules transition; calling again cancels and restarts timer.