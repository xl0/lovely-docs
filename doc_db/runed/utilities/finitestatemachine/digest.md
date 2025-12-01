## FiniteStateMachine

A strongly-typed finite state machine for tracking and manipulating systems with multiple discrete states and events that trigger transitions between them.

### Basic Usage

Create an FSM by specifying the initial state and a configuration object mapping each state to its valid events and target states:

```ts
import { FiniteStateMachine } from "runed";
type MyStates = "on" | "off";
type MyEvents = "toggle";

const f = new FiniteStateMachine<MyStates, MyEvents>("off", {
	off: { toggle: "on" },
	on: { toggle: "off" }
});

f.send("toggle"); // transition to next state
```

### Actions

Instead of string state names, use functions that return states to implement conditional logic and dynamic transitions:

```ts
const f = new FiniteStateMachine<MyStates, MyEvents>("off", {
	off: {
		toggle: () => {
			if (isTuesday) return "on";
			// returning nothing prevents transition
		}
	},
	on: {
		toggle: (heldMillis: number) => {
			if (heldMillis > 3000) return "off";
		}
	}
});

f.send("toggle", 5000); // pass arguments to action
```

### Lifecycle Methods

Define `_enter` and `_exit` handlers that run when entering or leaving a state:

```ts
const f = new FiniteStateMachine<MyStates, MyEvents>("off", {
	off: {
		toggle: "on",
		_enter: (meta) => console.log("off"),
		_exit: (meta) => console.log("leaving off")
	},
	on: {
		toggle: "off",
		_enter: (meta) => console.log("on"),
		_exit: (meta) => console.log("leaving on")
	}
});
```

The metadata object contains: `from` (exited state), `to` (entered state), `event` (triggering event name), and `args` (optional additional parameters passed to `f.send()`). For the initial state's `_enter`, both `from` and `event` are `null`.

### Wildcard Handlers

Use the special `*` state as a fallback for events not handled by the current state:

```ts
const f = new FiniteStateMachine<MyStates, MyEvents>("off", {
	off: { toggle: "on" },
	on: { toggle: "off" },
	"*": { emergency: "off" } // handles emergency from any state
});
```

### Debouncing

Schedule state transitions after a delay using `debounce()`. Calling it again with the same event cancels the previous timer:

```ts
f.debounce(5000, "toggle"); // transition in 5 seconds
f.debounce(5000, "toggle"); // cancels previous, starts new timer

// Use in actions or lifecycle methods:
const f = new FiniteStateMachine<MyStates, MyEvents>("off", {
	off: {
		toggle: () => {
			f.debounce(5000, "toggle");
			return "on";
		}
	},
	on: { toggle: "off" }
});
```

### Notes

Minimalistic implementation inspired by kenkunz/svelte-fsm. For more advanced features, consider statelyai/xstate.