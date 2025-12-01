

## Pages

### activeelement
Reactive wrapper around document.activeElement with Shadow DOM support and optional custom document/shadow root scoping.

## activeElement

Provides reactive access to the currently focused DOM element, similar to `document.activeElement` but with automatic reactive updates whenever focus changes.

### Key Features
- Synchronous updates with DOM focus changes
- Returns `null` when no element is focused
- SSR-safe
- Searches through Shadow DOM boundaries to find the true active element
- Lightweight alternative to manual focus tracking

### Basic Usage

```svelte
<script lang="ts">
	import { activeElement } from "runed";
</script>

<p>
	Currently active element:
	{activeElement.current?.localName ?? "No active element found"}
</p>
```

### Custom Document/Shadow Root

To scope focus tracking within a custom document or shadow root, pass a `DocumentOrShadowRoot` to the `ActiveElement` constructor:

```svelte
<script lang="ts">
	import { ActiveElement } from "runed";

	const activeElement = new ActiveElement({
		document: shadowRoot
	});
</script>
```

### Type Definition

```ts
interface ActiveElement {
	readonly current: Element | null;
}
```

The `current` property holds the currently focused element or `null` if no element has focus.

### animationframes
Declarative requestAnimationFrame wrapper with FPS limiting, frame metrics (fps, delta), and automatic cleanup.

## AnimationFrames

A declarative wrapper around the browser's `requestAnimationFrame` API that provides FPS limiting and frame metrics with automatic cleanup.

### Purpose
Simplifies animation loops by handling frame timing, FPS control, and performance metrics without manual cleanup.

### Key Features
- **FPS Limiting**: Control animation frame rate via `fpsLimit` option (0 = unlimited)
- **Frame Metrics**: Access `fps` property for current frames per second and `delta` for milliseconds since last frame
- **Automatic Cleanup**: Handles cleanup automatically
- **Declarative API**: Callback-based approach integrated with reactive state

### Usage
Create an instance with a callback function and options:

```svelte
const animation = new AnimationFrames(
	(args) => {
		frames++;
		delta = args.delta;
	},
	{ fpsLimit: () => fpsLimit }
);
```

The callback receives an object with `delta` (time since last frame in milliseconds). The `fpsLimit` option accepts a function that returns the desired FPS limit (0 for no limit).

### Properties
- `animation.fps`: Current frames per second (number)
- `animation.running`: Whether the animation is currently running (boolean)

### Control
Start/stop the animation by toggling `animation.running` or calling appropriate methods.

### boolattr
boolAttr(value: unknown): "" | undefined - converts values to empty string (truthy) or undefined (falsy) for proper HTML boolean attribute rendering

## boolAttr

Transforms any value into `""` (empty string) or `undefined` for use with HTML boolean attributes where presence indicates truth.

### Problem
Boolean values rendered directly in Svelte attributes become string values, causing both truthy and falsy states to render the attribute as present:
```svelte
<div data-active={true}>Content</div>  <!-- renders as: <div data-active="true"> -->
<div data-active={false}>Content</div> <!-- renders as: <div data-active="false"> -->
```

### Solution
`boolAttr` ensures proper boolean attribute behavior by returning an empty string for truthy values (attribute present) or undefined for falsy values (attribute absent):
```svelte
<script lang="ts">
	import { boolAttr } from "runed";
	let isActive = $state(true);
	let isLoading = $state(false);
</script>

<div data-active={boolAttr(isActive)}>Active content</div>    <!-- renders as: <div data-active> -->
<div data-loading={boolAttr(isLoading)}>Loading content</div>  <!-- renders as: <div> -->
```

### Type Definition
```ts
function boolAttr(value: unknown): "" | undefined;
```

**Parameters:**
- `value` (`unknown`) - Any value to be converted to a boolean attribute

**Returns:**
- `""` (empty string) - When `value` is truthy
- `undefined` - When `value` is falsy

### context
Type-safe Svelte Context API wrapper with get/set/exists methods; define with type parameter, set during component initialization, retrieve in children with fallback support.

## Purpose
Type-safe wrapper around Svelte's Context API for sharing data between components without prop drilling. Useful for themes, authentication state, localization preferences, and other shared data.

## Creating Context
Define a Context instance with a type parameter:
```ts
import { Context } from "runed";
export const myTheme = new Context<"light" | "dark">("theme");
```
The constructor parameter is just an identifier for debugging. Creating a Context only defines the container—it doesn't set a value yet.

## Setting Context Values
Set the context value in a parent component during initialization (like lifecycle functions):
```svelte
<script lang="ts">
	import { myTheme } from "./context";
	let { data, children } = $props();
	myTheme.set(data.theme);
</script>
{@render children?.()}
```
Context must be set during component initialization, not in event handlers or callbacks.

## Reading Context Values
Child components access context using `get()` or `getOr()`:
```svelte
<script lang="ts">
	import { myTheme } from "./context";
	const theme = myTheme.get(); // throws if not set
	const theme = myTheme.getOr("light"); // fallback value
</script>
```

## API
- `constructor(name: string)` - Creates context with identifier for debugging
- `key: symbol` - Internal key (use methods instead of accessing directly)
- `exists(): boolean` - Check if context is set in parent
- `get(): TContext` - Retrieve context, throws if not set
- `getOr<TFallback>(fallback: TFallback): TContext | TFallback` - Retrieve with fallback
- `set(context: TContext): TContext` - Set context value and return it

All methods must be called during component initialization.

### debounced
Debounced state wrapper with delay; access via `.current`, control with `.cancel()`, `.setImmediately()`, `.updateImmediately()`

## Debounced

A wrapper over `useDebounce` that returns a debounced state. Useful for delaying state updates, commonly used for search inputs or other user interactions that shouldn't trigger immediately.

### Basic Usage

Create a debounced state by passing a getter function and delay in milliseconds:

```ts
let search = $state("");
const debounced = new Debounced(() => search, 500);
```

The debounced value is accessed via `debounced.current`. In the example above, when `search` changes, `debounced.current` will update after 500ms of inactivity.

### Methods

- `cancel()` - Cancels any pending debounced update, keeping the current debounced value unchanged
- `setImmediately(value)` - Sets a new value immediately and cancels any pending updates
- `updateImmediately()` - Runs the pending update immediately without waiting for the delay

### Example with all methods

```ts
let count = $state(0);
const debounced = new Debounced(() => count, 500);

count = 1;
debounced.cancel(); // Cancels the pending update
// debounced.current remains 0

count = 2;
debounced.setImmediately(count); // Sets to 2 immediately
// debounced.current is now 2

count = 3;
await debounced.updateImmediately(); // Runs pending update immediately
// debounced.current is now 3
```

### elementrect
ElementRect: reactive DOMRect tracking with individual property accessors and optional initial dimensions

## ElementRect

Provides reactive access to an element's dimensions and position information, automatically updating when the element's size or position changes.

### Usage

```svelte
<script lang="ts">
	import { ElementRect } from "runed";

	let el = $state<HTMLElement>();
	const rect = new ElementRect(() => el);
</script>

<textarea bind:this={el}></textarea>

<p>Width: {rect.width} Height: {rect.height}</p>
<pre>{JSON.stringify(rect.current, null, 2)}</pre>
```

Pass a getter function that returns an HTMLElement (or undefined/null). Access dimensions via individual properties (`width`, `height`, `top`, `left`, `right`, `bottom`, `x`, `y`) or the complete `current` object containing all DOMRect properties except `toJSON`.

### Type Definition

```ts
type Rect = Omit<DOMRect, "toJSON">;

interface ElementRectOptions {
	initialRect?: DOMRect;
}

class ElementRect {
	constructor(node: MaybeGetter<HTMLElement | undefined | null>, options?: ElementRectOptions);
	readonly current: Rect;
	readonly width: number;
	readonly height: number;
	readonly top: number;
	readonly left: number;
	readonly right: number;
	readonly bottom: number;
	readonly x: number;
	readonly y: number;
}
```

Constructor accepts an optional `initialRect` option to set initial dimensions before the element is measured.

### elementsize
Reactive width/height tracker for DOM elements; constructor takes element getter function, exposes readonly width/height number properties

## ElementSize

Provides reactive access to an element's width and height, automatically updating when the element's dimensions change. Similar to ElementRect but focused only on size measurements.

### Usage

```svelte
<script lang="ts">
	import { ElementSize } from "runed";

	let el = $state() as HTMLElement;
	const size = new ElementSize(() => el);
</script>

<textarea bind:this={el}></textarea>

<p>Width: {size.width} Height: {size.height}</p>
```

Pass a function that returns the target element to the constructor. Access the reactive `width` and `height` properties to get current dimensions.

### Type Definition

```ts
interface ElementSize {
	readonly width: number;
	readonly height: number;
}
```

The interface exposes two readonly properties: `width` and `height`, both numbers representing the element's current dimensions in pixels.

### extract
Utility that resolves MaybeGetter<T> (getter or static value) to plain value with optional fallback, supporting undefined coalescing.

## Purpose
`extract` resolves either a getter function or a static value to a plain value, simplifying utility functions that accept both reactive and static inputs.

## Problem It Solves
APIs often accept `MaybeGetter<T>` - either a reactive getter or a static value. Without `extract`, handling both requires verbose conditional logic:
```ts
typeof wait === "function" ? (wait() ?? 250) : (wait ?? 250)
```

## Usage
```ts
import { extract } from "runed";

function throwConfetti(intervalProp?: MaybeGetter<number | undefined>) {
	const interval = $derived(extract(intervalProp, 100));
}
```

## Behavior
`extract(input, fallback)` handles four cases:
- Static value → returns the value
- `undefined` → returns the fallback
- Function returning a value → returns the function result
- Function returning `undefined` → returns the fallback

The fallback is optional; omitting it returns `T | undefined`.

## Type Signatures
```ts
function extract<T>(input: MaybeGetter<T | undefined>, fallback: T): T;
function extract<T>(input: MaybeGetter<T | undefined>): T | undefined;
```

### finitestatemachine
Strongly-typed FSM with state/event configuration, conditional actions, lifecycle hooks (_enter/_exit), wildcard fallback (*), and debounced transitions.

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

### isdocumentvisible
Reactive document visibility tracker using Page Visibility API; exposes boolean `current` property that updates on visibility changes.

## IsDocumentVisible

Reactive boolean that tracks whether the current document is visible using the Page Visibility API.

### Purpose
Monitors document visibility state by listening to the `visibilitychange` event and automatically updates when visibility changes (e.g., when user switches tabs or minimizes the window).

### Usage
```svelte
<script lang="ts">
	import { IsDocumentVisible } from "runed";

	const visible = new IsDocumentVisible();
</script>

<p>Document visible: {visible.current ? "Yes" : "No"}</p>
```

### API
- Constructor accepts optional `IsDocumentVisibleOptions` with `window` and `document` properties for custom contexts
- `current` property: boolean that is `true` when document is visible, `false` when hidden

### Implementation Details
- Built on Page Visibility API using `document.hidden` and `visibilitychange` event
- In non-browser environments, `current` defaults to `false`

### isfocuswithin
IsFocusWithin class tracks whether any descendant has focus in a container; constructor takes element getter, exposes readonly current boolean property.

A utility class that reactively tracks whether any descendant element has focus within a specified container element. Updates automatically when focus changes.

**Constructor**: Takes a getter function that returns an HTMLElement, undefined, or null.

**Property**: `current` - a readonly boolean indicating whether focus is currently within the container.

**Usage example**:
```svelte
<script lang="ts">
	import { IsFocusWithin } from "runed";

	let formElement = $state<HTMLFormElement>();
	const focusWithinForm = new IsFocusWithin(() => formElement);
</script>

<p>Focus within form: {focusWithinForm.current}</p>
<form bind:this={formElement}>
	<input type="text" />
	<button type="submit">Submit</button>
</form>
```

The utility accepts a MaybeGetter (either a direct value or a getter function) for the target element, making it flexible for reactive element references.

### isidle
IsIdle sensor tracks user activity with configurable timeout and events, exposing idle state and last activity timestamp.

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

### isinviewport
Class that reactively tracks viewport visibility of DOM elements via Intersection Observer; exposes boolean `current` property.

## IsInViewport

Tracks whether an element is visible within the current viewport using the Intersection Observer API.

### Purpose
Provides a reactive way to detect if a DOM element is currently visible in the viewport, useful for lazy loading, analytics, or triggering animations when elements come into view.

### How It Works
- Built on top of the `useIntersectionObserver` utility
- Accepts an element or a getter function that returns an element
- Supports optional configuration options that align with `useIntersectionObserver` options

### Usage
```svelte
<script lang="ts">
	import { IsInViewport } from "runed";

	let targetNode = $state<HTMLElement>()!;
	const inViewport = new IsInViewport(() => targetNode);
</script>

<p bind:this={targetNode}>Target node</p>

<p>Target node in viewport: {inViewport.current}</p>
```

### API
- **Constructor**: `new IsInViewport(node, options?)`
  - `node`: HTMLElement or getter function returning HTMLElement | null | undefined
  - `options`: Optional IsInViewportOptions (same as UseIntersectionObserverOptions)
- **Property**: `current` - boolean getter that returns true if element is in viewport

### ismounted
IsMounted class provides mounted state tracking via .current property; shorthand for onMount or $effect patterns

## IsMounted

A utility class that tracks whether a component has been mounted. Returns an object with a `current` property that is `false` initially and becomes `true` after the component mounts.

### Usage

```svelte
<script lang="ts">
	import { IsMounted } from "runed";

	const isMounted = new IsMounted();
</script>
```

The `isMounted.current` property can then be used in templates or reactive code to conditionally render or execute logic only after mount.

### Equivalent implementations

Using `onMount`:
```svelte
<script lang="ts">
	import { onMount } from "svelte";

	const isMounted = $state({ current: false });

	onMount(() => {
		isMounted.current = true;
	});
</script>
```

Using `$effect` with `untrack`:
```svelte
<script lang="ts">
	import { untrack } from "svelte";

	const isMounted = $state({ current: false });

	$effect(() => {
		untrack(() => (isMounted.current = true));
	});
</script>
```

The class provides a convenient shorthand for these common patterns.

### oncleanup
onCleanup registers a callback invoked on effect context disposal (component destroy or root effect end); shorthand for returning cleanup from $effect().

## onCleanup

Registers a cleanup function that executes when the current effect context is disposed (component destruction or root effect disposal).

**Purpose**: Provides a shorthand for cleanup logic that would otherwise require returning a function from `$effect()`.

**Equivalent to**:
```ts
$effect(() => {
	return () => {
		// cleanup
	};
});
```

**Usage Examples**:

As a replacement for `onDestroy`:
```svelte
<script lang="ts">
	import { onCleanup } from "runed";

	onCleanup(() => {
		console.log("Component is being cleaned up!");
	});
</script>
```

Within a root effect:
```ts
$effect.root(() => {
	onCleanup(() => {
		console.log("Root effect is being cleaned up!");
	});
});
```

**Type Signature**:
```ts
function onCleanup(cb: () => void): void;
```

The callback receives no arguments and returns void.

### onclickoutside
Detects clicks outside an element; returns start/stop/enabled for control; supports immediate/detectIframe/custom document/window options.

## Purpose
`onClickOutside` detects clicks outside a specified element's boundaries and executes a callback. Common use cases include dismissible dropdowns, modals, and other interactive components.

## Basic Usage
```svelte
import { onClickOutside } from "runed";

let container = $state<HTMLElement>()!;

onClickOutside(
	() => container,
	() => console.log("clicked outside")
);
```

## Controlled Listener
The function returns control methods: `start()` and `stop()` to programmatically manage the listener, plus a reactive read-only `enabled` property to check current status.

```svelte
const clickOutside = onClickOutside(
	() => dialog,
	() => {
		dialog.close();
		clickOutside.stop();
	},
	{ immediate: false }
);

function openDialog() {
	dialog.showModal();
	clickOutside.start();
}

function closeDialog() {
	dialog.close();
	clickOutside.stop();
}
```

## Options
- `immediate` (boolean, default: true): Whether the handler is enabled by default. If false, call `start()` to activate.
- `detectIframe` (boolean, default: false): Whether focus events from iframes trigger the callback. Enable if you need to detect interactions with iframe content.
- `document` (Document, default: global document): The document object to use.
- `window` (Window, default: global window): The window object to use.

## Type Signature
```ts
function onClickOutside<T extends Element = HTMLElement>(
	container: MaybeElementGetter<T>,
	callback: (event: PointerEvent | FocusEvent) => void,
	opts?: OnClickOutsideOptions
): {
	stop: () => boolean;
	start: () => boolean;
	readonly enabled: boolean;
}
```

The container parameter accepts either an element or a getter function returning an element. The callback receives either a PointerEvent or FocusEvent.

### persistedstate
Reactive state container with automatic browser storage persistence, cross-tab synchronization, connection control, and custom serialization support.

## PersistedState

A reactive state manager that automatically persists data to browser storage (localStorage or sessionStorage) and optionally synchronizes changes across browser tabs in real-time.

### Basic Usage

```ts
import { PersistedState } from "runed";

const count = new PersistedState("count", 0);
count.current++; // Automatically persists
```

### Complex Objects

Only plain structures are deeply reactive: arrays, plain objects, and primitive values. Class instances require reassignment to persist:

```ts
const persistedArray = new PersistedState("foo", ["a", "b"]);
persistedArray.current.push("c"); // Persists

const persistedObject = new PersistedState("bar", { name: "Bob" });
persistedObject.current.name = "JG"; // Persists

class Person {
	name: string;
	constructor(name: string) { this.name = name; }
}
const persistedComplexObject = new PersistedState("baz", new Person("Bob"));
persistedComplexObject.current.name = "JG"; // Does NOT persist
persistedComplexObject.current = new Person("JG"); // Persists
```

### Configuration Options

```ts
const state = new PersistedState("key", initialValue, {
	storage: "session",      // 'local' (default) or 'session'
	syncTabs: false,         // Cross-tab sync (default: true)
	connected: false,        // Start disconnected (default: true)
	serializer: {            // Custom serialization
		serialize: superjson.stringify,
		deserialize: superjson.parse
	}
});
```

### Connection Control

Control when state connects to storage:

```ts
const state = new PersistedState("temp-data", initialValue, { connected: false });
state.current = "new value"; // Kept in memory only
state.connect();             // Persists to storage
console.log(state.connected); // true
state.disconnect();          // Removes from storage, keeps in memory
```

When disconnected: state changes are in-memory only, storage changes don't reflect in state, and cross-tab sync is disabled. `disconnect()` removes from storage but preserves the value in memory. `connect()` immediately persists the current in-memory value to storage.

### Storage Options

- `'local'`: Data persists until explicitly cleared
- `'session'`: Data persists until browser session ends

### Cross-Tab Synchronization

When `syncTabs` is enabled (default), changes automatically synchronize across all browser tabs using storage events.

### Custom Serialization

Handle complex data types like Dates:

```ts
import superjson from "superjson";

const lastAccessed = new PersistedState("last-accessed", new Date(), {
	serializer: {
		serialize: superjson.stringify,
		deserialize: superjson.parse
	}
});
```

### pressedkeys
Keyboard key press tracker with methods to check individual/combined keys, list all pressed keys, and register key combination callbacks.

## PressedKeys

A sensor utility that tracks which keyboard keys are currently pressed.

### Creating an instance
```ts
const keys = new PressedKeys();
```

### Checking if keys are pressed
Use the `has` method to check if a specific key or key combination is currently pressed:
```ts
const isArrowDownPressed = $derived(keys.has("ArrowDown"));
const isCtrlAPressed = $derived(keys.has("Control", "a"));
```

### Getting all pressed keys
Access the `all` property to get a collection of all currently pressed keys:
```ts
console.log(keys.all);
```

### Registering key combination callbacks
Use the `onKeys` method to execute a callback when a specific key combination is pressed:
```ts
keys.onKeys(["meta", "k"], () => {
	console.log("open command palette");
});
```

### previous
Reactive utility tracking previous getter values for state comparisons and transitions; access via `current` property.

The `Previous` utility creates a reactive wrapper that maintains the previous value of a getter function, enabling state change comparisons and transition effects.

**Type Definition:**
```ts
class Previous<T> {
	constructor(getter: () => T);
	readonly current: T | undefined; // Previous value
}
```

**Usage:**
```svelte
<script lang="ts">
	import { Previous } from "runed";

	let count = $state(0);
	const previous = new Previous(() => count);
</script>

<div>
	<button onclick={() => count++}>Count: {count}</button>
	<pre>Previous: {`${previous.current}`}</pre>
</div>
```

The constructor accepts a getter function that returns the value to track. The `current` property provides access to the previous value, which is `undefined` until the tracked value changes at least once.

### resource
Reactive async data fetcher with automatic cancellation, loading/error states, debounce/throttle, cleanup hooks, and pre-render support.

## Purpose
`resource` is a utility that combines reactive state management with async data fetching. It runs after rendering by default, with a pre-render option via `resource.pre()`. Built on top of `watch`, it's designed for component-level reactive data fetching when you need more flexibility than SvelteKit's load functions.

## Core API
```svelte
const searchResource = resource(
  () => id,  // source: reactive dependency
  async (id, prevId, { data, refetching, onCleanup, signal }) => {
    // fetcher function
    const response = await fetch(`api/posts?id=${id}`, { signal });
    return response.json();
  },
  { debounce: 300 }  // options
);

// Properties
searchResource.current;    // current value
searchResource.loading;    // boolean
searchResource.error;      // Error | undefined
searchResource.mutate(value);  // direct update (optimistic updates)
searchResource.refetch();  // re-run fetcher
```

## Fetcher Parameters
- `value`: current source value
- `previousValue`: previous source value
- `data`: previous fetcher return value
- `refetching`: boolean or custom value passed to `refetch(info)`
- `onCleanup(fn)`: register cleanup before refetch
- `signal`: AbortSignal for cancelling requests

## Configuration Options
- `lazy`: skip initial fetch, only fetch on dependency changes or `refetch()`
- `once`: fetch only once, ignore subsequent dependency changes
- `initialValue`: provide initial value before first fetch completes
- `debounce`: milliseconds to debounce rapid changes (cancels pending requests, executes last one after delay)
- `throttle`: milliseconds to throttle rapid changes (spaces requests by delay, returns pending promise if called too soon)
- Note: use either debounce or throttle, not both; debounce takes precedence

## Features
- Automatic request cancellation when dependencies change
- Built-in loading and error states
- Debouncing and throttling for rate limiting
- Full TypeScript support with inferred types
- Multiple dependencies support: `resource([() => query, () => page], async ([query, page]) => ...)`
- Custom cleanup functions via `onCleanup()`
- Pre-render execution via `resource.pre()`

## Examples

**Basic usage with single dependency:**
```svelte
let id = $state(1);
const searchResource = resource(
  () => id,
  async (id, prevId, { signal }) => {
    const response = await fetch(`api/posts?id=${id}`, { signal });
    return response.json();
  },
  { debounce: 300 }
);
```

**Multiple dependencies:**
```svelte
const results = resource(
  [() => query, () => page],
  async ([query, page]) => {
    const res = await fetch(`/api/search?q=${query}&page=${page}`);
    return res.json();
  }
);
```

**Custom cleanup (e.g., EventSource):**
```svelte
const stream = resource(
  () => streamId,
  async (id, _, { signal, onCleanup }) => {
    const eventSource = new EventSource(`/api/stream/${id}`);
    onCleanup(() => eventSource.close());
    const res = await fetch(`/api/stream/${id}/init`, { signal });
    return res.json();
  }
);
```

**Pre-render execution:**
```svelte
const data = resource.pre(
  () => query,
  async (query) => {
    const res = await fetch(`/api/search?q=${query}`);
    return res.json();
  }
);
```

### scrollstate
Reactive scroll position/direction tracker with edge detection, progress reporting, and programmatic scrolling for elements/window/document with RTL and flex layout support.

## ScrollState

A reactive utility for tracking and controlling scroll behavior on DOM elements, window, or document.

### Core Capabilities

- **Position Tracking**: Access current scroll positions via `scroll.x` and `scroll.y` (reactive, get/set)
- **Direction Detection**: `scroll.directions` identifies active scroll directions (left, right, top, bottom)
- **Edge Detection**: `scroll.arrived` object indicates whether scroll has reached each edge
- **Progress Tracking**: `scroll.progress` provides percentage scrolled on x/y axes
- **Programmatic Scrolling**: `scroll.scrollTo(x, y)`, `scroll.scrollToTop()`, `scroll.scrollToBottom()`
- **Event Handling**: Listen to scroll and scroll-end events via callbacks
- **Layout Support**: Respects flex, RTL, and reverse layout modes

### Configuration Options

| Option | Type | Default | Purpose |
|--------|------|---------|---------|
| `element` | `MaybeGetter<HTMLElement \| Window \| Document \| null>` | Required | The scroll container |
| `idle` | `MaybeGetter<number \| undefined>` | 200ms | Debounce time after scroll ends |
| `offset` | `{ top?, bottom?, left?, right? }` | 0 | Pixel thresholds for edge detection |
| `onScroll` | `(e: Event) => void` | — | Scroll event callback |
| `onStop` | `(e: Event) => void` | — | Callback after scrolling stops |
| `eventListenerOptions` | `AddEventListenerOptions` | `{ passive: true, capture: false }` | Scroll listener configuration |
| `behavior` | `ScrollBehavior` | "auto" | Scroll animation: "auto", "smooth", etc. |
| `onError` | `(error: unknown) => void` | `console.error` | Error handler |

### Usage Example

```svelte
<script lang="ts">
	import { ScrollState } from "runed";

	let el = $state<HTMLElement>();

	const scroll = new ScrollState({
		element: () => el,
		idle: 300,
		offset: { top: 50, bottom: 50 }
	});
</script>

<div bind:this={el} style="overflow: auto; height: 200px;">
	{#if scroll.arrived.top}
		<p>At top</p>
	{/if}
	{#if scroll.directions.down}
		<p>Scrolling down</p>
	{/if}
	<button onclick={() => scroll.scrollToBottom()}>Go to bottom</button>
</div>
```

### Key Behaviors

- Both position (`x`, `y`) and edge arrival state (`arrived`) are reactive and can be set programmatically to trigger scrolling
- `onStop` is debounced and fires after scrolling ends and idle time elapses
- Layout direction and reverse flex settings are automatically considered in edge state calculations

### statehistory
StateHistory utility for tracking state changes with undo/redo via getter/setter functions; provides log array with snapshots/timestamps, undo/redo/clear methods, and canUndo/canRedo booleans.

## StateHistory

Tracks state changes with undo/redo capabilities. Requires a getter function to read the current state and a setter function to apply state changes.

### Basic Usage

```ts
import { StateHistory } from "runed";

let count = $state(0);
const history = new StateHistory(() => count, (c) => (count = c));
history.log[0]; // { snapshot: 0, timestamp: ... }
```

### Methods

**`undo()`** - Reverts state to the previous value in history log, moving current state to redo stack.

```ts
let count = $state(0);
const history = new StateHistory(() => count, (c) => (count = c));
count = 1;
count = 2;
history.undo(); // count is now 1
history.undo(); // count is now 0
```

**`redo()`** - Restores a previously undone state from the redo stack.

```ts
history.undo(); // count is now 1
history.redo();  // count is now 2
```

**`clear()`** - Clears entire history log and redo stack.

```ts
history.clear();
console.log(history.log); // []
console.log(history.canUndo); // false
console.log(history.canRedo); // false
```

### Properties

**`log`** - Array of `LogEvent<T>` objects, each containing a `snapshot` of the state and a `timestamp`.

**`canUndo`** - Derived boolean indicating whether undo is possible (true when log has more than one item).

**`canRedo`** - Derived boolean indicating whether redo is possible (true when redo stack is not empty).

### Example in Svelte Component

```svelte
<script lang="ts">
	import { StateHistory } from "runed";
	let count = $state(0);
	const history = new StateHistory(() => count, (c) => (count = c));
</script>

<p>{count}</p>
<button onclick={() => count++}>Increment</button>
<button onclick={() => count--}>Decrement</button>
<button disabled={!history.canUndo} onclick={history.undo}>Undo</button>
<button disabled={!history.canRedo} onclick={history.redo}>Redo</button>
<button onclick={history.clear}>Clear History</button>
```

### textareaautosize
Textarea utility that auto-resizes vertically by measuring an off-screen clone; supports grow-only mode via minHeight and optional max-height limit.

## TextareaAutosize

Utility that automatically adjusts textarea height based on content without layout shifts.

### How it works
- Creates an invisible off-screen textarea clone
- Copies computed styles from the actual textarea
- Measures scroll height of the clone to determine needed height
- Applies the height (or minHeight) to the real textarea
- Recalculates on content changes, element resizes, and width changes

### Basic usage
```svelte
<script lang="ts">
	import { TextareaAutosize } from "runed";

	let el = $state<HTMLTextAreaElement>(null!);
	let value = $state("");

	new TextareaAutosize({
		element: () => el,
		input: () => value
	});
</script>

<textarea bind:this={el} bind:value></textarea>
```

### Options
| Option | Type | Description |
|--------|------|-------------|
| `element` | `Getter<HTMLElement \| undefined>` | The target textarea (required) |
| `input` | `Getter<string>` | Reactive input value (required) |
| `onResize` | `() => void` | Called whenever the height is updated |
| `styleProp` | `"height"` \| `"minHeight"` | CSS property to control size. `"height"` resizes both ways, `"minHeight"` grows only. Default: `"height"` |
| `maxHeight` | `number` | Maximum height in pixels before scroll appears. Default: unlimited |

### Grow-only behavior
```ts
new TextareaAutosize({
	element: () => el,
	input: () => value,
	styleProp: "minHeight"
});
```
Using `styleProp: "minHeight"` lets the textarea expand as needed but won't shrink smaller than its current size.

### throttled
Throttled state wrapper: delays reactive value updates by specified interval; supports cancel() and setImmediately() for manual control.

## Throttled

A wrapper over `useThrottle` that returns a throttled state. Throttles updates to a reactive value, delaying state changes by a specified interval.

### Basic Usage

Create a throttled state by passing a getter function and throttle interval in milliseconds:

```ts
let search = $state("");
const throttled = new Throttled(() => search, 500);
```

The throttled value is accessed via `throttled.current`. Updates to the source value are delayed by the throttle interval before reflecting in the throttled state.

### Controlling Updates

Two methods control pending updates:

- `cancel()` - Cancels any pending throttled update, keeping the current throttled value unchanged
- `setImmediately(value)` - Sets a new value immediately and cancels any pending updates

### Example with Control Methods

```ts
let count = $state(0);
const throttled = new Throttled(() => count, 500);

count = 1;
throttled.cancel();
console.log(throttled.current); // Still 0

count = 2;
console.log(throttled.current); // Still 0
throttled.setImmediately(count);
console.log(throttled.current); // 2
```

### usedebounce
Debounce utility that delays callback execution until after specified inactivity duration; supports dynamic duration via function, immediate execution, and cancellation.

## Purpose
`useDebounce` creates a debounced version of a callback function, preventing frequent execution by delaying it until after a specified duration of inactivity.

## API
- **Function signature**: `useDebounce(callback, durationFn)` - takes a callback and a function that returns the debounce duration in milliseconds
- **Returns object with**:
  - `pending` - boolean indicating if a debounced call is scheduled
  - `runScheduledNow()` - method to execute the scheduled callback immediately
  - `cancel()` - method to cancel the pending scheduled execution

## Example
```svelte
<script lang="ts">
	import { useDebounce } from "runed";

	let count = $state(0);
	let logged = $state("");
	let debounceDuration = $state(1000);

	const logCount = useDebounce(
		() => {
			logged = `You pressed the button ${count} times!`;
			count = 0;
		},
		() => debounceDuration
	);

	function ding() {
		count++;
		logCount();
	}
</script>

<input type="number" bind:value={debounceDuration} />
<button onclick={ding}>DING DING DING</button>
<button onclick={logCount.runScheduledNow} disabled={!logCount.pending}>Run now</button>
<button onclick={logCount.cancel} disabled={!logCount.pending}>Cancel</button>
<p>{logged}</p>
```

The duration function allows dynamic debounce timing. Calling the debounced function multiple times within the duration resets the timer. Use `runScheduledNow()` to force immediate execution or `cancel()` to discard the pending call.

### useeventlistener
Automatically disposed event listener function accepting target element getter, event name, and callback with automatic cleanup on component destruction or element reference changes.

## useEventListener

A function that attaches an automatically disposed event listener to DOM elements.

### Purpose
Useful for attaching event listeners to elements you don't directly control, such as the document body, window, or element references received from parent components. Eliminates the need for manual cleanup.

### Key Features
- **Automatic Cleanup:** Event listener is removed automatically when the component is destroyed or when the element reference changes.
- **Lazy Initialization:** Target element can be defined using a function, enabling flexible and dynamic behavior.
- **Convenient for Global Listeners:** Ideal for scenarios where attaching event listeners directly to DOM elements is cumbersome or impractical.

### Example: Tracking Clicks

```ts
import { useEventListener } from "runed";

export class ClickLogger {
	#clicks = $state(0);

	constructor() {
		useEventListener(
			() => document.body,
			"click",
			() => this.#clicks++
		);
	}

	get clicks() {
		return this.#clicks;
	}
}
```

Usage in a Svelte component:
```svelte
<script lang="ts">
	import { ClickLogger } from "./ClickLogger.ts";
	const logger = new ClickLogger();
</script>

<p>
	You've clicked the document {logger.clicks}
	{logger.clicks === 1 ? "time" : "times"}
</p>
```

The function accepts a target element getter function, event name, and callback handler. The listener automatically cleans up when the component unmounts or the element reference changes.

### usegeolocation
Reactive Geolocation API wrapper providing position tracking with pause/resume control, error handling, and browser support detection.

Reactive wrapper around the browser's Geolocation API for accessing device location.

**Core Functionality:**
- Tracks device position reactively with automatic updates
- Provides access to coordinates, timestamp, and errors
- Supports pause/resume control for tracking
- Detects API support across browsers

**Usage:**
```svelte
<script lang="ts">
	import { useGeolocation } from "runed";
	const location = useGeolocation();
</script>

<pre>Coords: {JSON.stringify(location.position.coords, null, 2)}</pre>
<pre>Located at: {location.position.timestamp}</pre>
<pre>Error: {JSON.stringify(location.error, null, 2)}</pre>
<pre>Is Supported: {location.isSupported}</pre>
<button onclick={location.pause} disabled={location.isPaused}>Pause</button>
<button onclick={location.resume} disabled={!location.isPaused}>Resume</button>
```

**API:**
- `isSupported`: boolean indicating Geolocation API availability
- `position`: GeolocationPosition object containing coords and timestamp
- `error`: GeolocationPositionError or null
- `isPaused`: boolean tracking pause state
- `pause()`: stops position tracking
- `resume()`: resumes position tracking

**Options:**
- `immediate`: boolean (default: true) - whether to start tracking immediately or wait for `resume()` call
- Accepts all standard PositionOptions (timeout, enableHighAccuracy, maximumAge)

### useintersectionobserver
useIntersectionObserver: observe element visibility changes with pause/resume/stop control and isActive getter

## useIntersectionObserver

Watch for intersection changes of a target element using the Intersection Observer API.

### Basic Usage

Pass a function returning the target element, a callback to handle intersection entries, and optional configuration:

```ts
import { useIntersectionObserver } from "runed";

let target = $state<HTMLElement | null>(null);
let isIntersecting = $state(false);

useIntersectionObserver(
	() => target,
	(entries) => {
		const entry = entries[0];
		if (!entry) return;
		isIntersecting = entry.isIntersecting;
	},
	{ root: () => root }
);
```

The callback receives an array of IntersectionObserverEntry objects. You can access properties like `isIntersecting` to determine if the target element is currently visible in the viewport or within a specified root element.

### Control Methods

The observer returns an object with control methods:

- `pause()` - Temporarily pause observation without stopping it
- `resume()` - Resume a paused observer
- `stop()` - Completely stop the observer

```ts
const observer = useIntersectionObserver(/* ... */);
observer.pause();
observer.resume();
observer.stop();
```

### isActive Property

Check if the observer is currently active via the `isActive` getter property. This cannot be destructured and must be accessed directly:

```ts
const observer = useIntersectionObserver(/* ... */);
if (observer.isActive) {
	// observer is running
}
```

### useinterval
Reactive setInterval wrapper with pause/resume, tick counter, and optional callback; delay can be reactive.

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

### usemutationobserver
useMutationObserver hook wraps MutationObserver API; takes element getter, mutation callback, and observer options; returns object with stop() method.

## useMutationObserver

Hook to observe changes in a DOM element using the MutationObserver API.

### Basic Usage

Pass an element reference, a callback function to handle mutations, and configuration options:

```ts
import { useMutationObserver } from "runed";

let el = $state<HTMLElement | null>(null);
const messages = $state<string[]>([]);

useMutationObserver(
	() => el,
	(mutations) => {
		const mutation = mutations[0];
		if (!mutation) return;
		messages.push(mutation.attributeName!);
	},
	{ attributes: true }
);
```

The callback receives an array of mutations. In this example, the `attributes: true` option enables observation of attribute changes. When the element's class or style attributes change, the mutation's `attributeName` is captured.

### Stopping the Observer

Call the `stop` method to halt observation:

```ts
const { stop } = useMutationObserver(/* ... */);
stop();
```

### useresizeobserver
Resize observer utility that tracks element dimension changes via callback, with manual stop control.

## useResizeObserver

Detects changes in the size of an element using the Resize Observer API.

### Basic Usage

Pass a function that returns an element reference and a callback that receives resize entries:

```ts
import { useResizeObserver } from "runed";

let el = $state<HTMLElement | null>(null);
let text = $state("");

useResizeObserver(
	() => el,
	(entries) => {
		const entry = entries[0];
		if (!entry) return;

		const { width, height } = entry.contentRect;
		text = `width: ${width};\nheight: ${height};`;
	}
);
```

The callback receives an array of ResizeObserverEntry objects. Access the element's dimensions via `entry.contentRect.width` and `entry.contentRect.height`.

### Stopping the Observer

Call the `stop` method returned from `useResizeObserver` to stop observing:

```ts
const { stop } = useResizeObserver(/* ... */);
stop();
```

### usesearchparams
Reactive, schema-validated URL search params with type safety, compression, debouncing, date formatting, custom codecs, and server-side validation; top-level reactivity only.

## useSearchParams

Reactive, type-safe, schema-driven management of URL search parameters in Svelte/SvelteKit. Automatically syncs parameters across tabs and sessions, validates against a schema, and provides direct property access with automatic URL updates.

### Core Features

- **Schema Validation**: Define types, defaults, and structure using Standard Schema (Zod, Valibot, Arktype, or built-in createSearchParamsSchema)
- **Type Safety**: All values parsed and validated to schema types
- **Default Values**: Missing params auto-filled with defaults
- **Compression**: Store all params in single compressed `_data` param for cleaner URLs
- **Debounce**: Optionally debounce updates to avoid cluttering browser history
- **History Control**: Choose between push (new history entry) or replace state
- **In-memory Mode**: Keep params in memory without updating URL
- **Invalid Param Handling**: Invalid values replaced with defaults and removed from URL
- **Date Formatting**: Control how Date parameters serialize (YYYY-MM-DD or ISO8601)
- **Custom Serialization**: Use Zod codecs for complete control over type conversions

### Basic Usage

```ts
// Define schema with Zod
const productSearchSchema = z.object({
  page: z.coerce.number().default(1),
  filter: z.string().default(""),
  sort: z.enum(["newest", "oldest", "price"]).default("newest")
});

// In component
const params = useSearchParams(productSearchSchema);
const page = $derived(params.page); // number (defaults to 1)
params.page = 2; // Updates URL to ?page=2
params.update({ page: 3, sort: 'oldest' }); // Update multiple at once
params.reset(); // Reset to defaults
params.toURLSearchParams(); // Get URLSearchParams object
```

### Options

- `showDefaults` (boolean): Show parameters with default values in URL (default: false)
- `debounce` (number): Milliseconds to delay URL updates (default: 0)
- `pushHistory` (boolean): Create new history entries on update (default: true)
- `compress` (boolean): Compress all params into single `_data` param (default: false)
- `compressedParamName` (string): Custom name for compressed param (default: '_data')
- `updateURL` (boolean): Update URL when params change (default: true)
- `noScroll` (boolean): Preserve scroll position on URL update (default: false)
- `dateFormats` (object): Map field names to 'date' (YYYY-MM-DD) or 'datetime' (ISO8601) format

```ts
const params = useSearchParams(schema, {
  showDefaults: true,
  debounce: 300,
  pushHistory: false,
  compress: true,
  compressedParamName: '_compressed',
  dateFormats: { birthDate: 'date', createdAt: 'datetime' }
});
```

### createSearchParamsSchema

Lightweight schema creator without external dependencies. Supports basic types with defaults, arrays, objects, and dates.

```ts
const schema = createSearchParamsSchema({
  page: { type: "number", default: 1 },
  filter: { type: "string", default: "" },
  tags: { type: "array", default: ["new"], arrayType: "" },
  config: { type: "object", default: { theme: "light" }, objectType: { theme: "" } },
  birthDate: { type: "date", default: new Date("1990-01-15"), dateFormat: "date" },
  createdAt: { type: "date", default: new Date(), dateFormat: "datetime" }
});
```

Limitations: No nested validation, no custom rules, no granular reactivity for nested properties (must reassign entire value).

### validateSearchParams

Server-side utility to extract and validate URL search parameters without modifying the URL. Works in SvelteKit load functions.

```ts
export const load = ({ url, fetch }) => {
  const { searchParams, data } = validateSearchParams(url, productSearchSchema, {
    compressedParamName: "_compressed",
    dateFormats: { birthDate: "date", createdAt: "datetime" }
  });
  const response = await fetch(`/api/products?${searchParams.toString()}`);
  return { products: await response.json() };
};
```

### Date Formatting

Two approaches to control Date serialization:

**Option 1: Schema property**
```ts
const schema = createSearchParamsSchema({
  birthDate: { type: "date", default: new Date("1990-01-15"), dateFormat: "date" },
  createdAt: { type: "date", default: new Date(), dateFormat: "datetime" }
});
```

**Option 2: useSearchParams option**
```ts
const params = useSearchParams(zodSchema, {
  dateFormats: { birthDate: "date", createdAt: "datetime" }
});
```

- `'date'` format: YYYY-MM-DD (e.g., 2025-10-21), parsed as midnight UTC
- `'datetime'` format (default): Full ISO8601 (e.g., 2025-10-21T18:18:14.196Z)

### Zod Codecs (Advanced)

For complete control over serialization, use Zod codecs (v4.1.0+) to define custom bidirectional transformations:

```ts
// Unix timestamp codec
const unixTimestampCodec = z.codec(
  z.coerce.number(),
  z.date(),
  {
    decode: (timestamp) => new Date(timestamp * 1000),
    encode: (date) => Math.floor(date.getTime() / 1000)
  }
);

// Date-only codec
const dateOnlyCodec = z.codec(
  z.string(),
  z.date(),
  {
    decode: (str) => new Date(str + "T00:00:00.000Z"),
    encode: (date) => date.toISOString().split("T")[0]
  }
);

// Compact ID codec (base36)
const compactIdCodec = z.codec(
  z.string(),
  z.number(),
  {
    decode: (str) => parseInt(str, 36),
    encode: (num) => num.toString(36)
  }
);

const schema = z.object({
  query: z.string().default(""),
  createdAfter: unixTimestampCodec.default(new Date("2024-01-01")),
  birthDate: dateOnlyCodec.default(new Date("1990-01-15")),
  productId: compactIdCodec.optional()
});

const params = useSearchParams(schema);
```

Codecs work automatically with `validateSearchParams` on the server.

### Reactivity Limitations

**Top-level reactivity only** - direct property assignment works, nested mutations don't:

✅ Works:
```ts
params.page = 2;
params.config = { theme: "dark", size: "large" };
params.items = [...params.items, newItem];
```

❌ Doesn't work:
```ts
params.config.theme = "dark"; // Nested property mutation
params.items.push(newItem); // Array method
params.items[0].name = "updated"; // Array item property
delete params.config.oldProp; // Property deletion
```

This design prioritizes simplicity, type safety, and performance over deep reactivity.

### Schema Examples

**Zod:**
```ts
const schema = z.object({
  page: z.number().default(1),
  filter: z.string().default(""),
  sort: z.enum(["newest", "oldest", "price"]).default("newest")
});
```

**Valibot:**
```ts
const schema = v.object({
  page: v.optional(v.fallback(v.number(), 1), 1),
  filter: v.optional(v.fallback(v.string(), ""), ""),
  sort: v.optional(v.fallback(v.picklist(["newest", "oldest", "price"]), "newest"), "newest")
});
```

**Arktype:**
```ts
const schema = type({
  page: "number = 1",
  filter: 'string = ""',
  sort: '"newest" | "oldest" | "price" = "newest"'
});
```

### URL Storage Format

- Arrays: JSON strings `?tags=["sale","featured"]`
- Objects: JSON strings `?config={"theme":"dark","fontSize":14}`
- Dates: ISO8601 `?createdAt=2023-12-01T10:30:00.000Z` or date-only `?birthDate=2023-12-01`
- Primitives: Direct `?page=2&filter=red`

### Type Definitions

`SearchParamsOptions` interface defines all configuration options. `ReturnUseSearchParams<Schema>` provides typed reactive params plus `update()`, `reset()`, and `toURLSearchParams()` methods. `SchemaTypeConfig` defines schema field types for `createSearchParamsSchema`.

### usethrottle
Higher-order function that throttles callback execution to at most once per specified duration interval.

## Purpose
A higher-order function that throttles function execution, ensuring a function is called at most once within a specified time interval.

## API
`useThrottle(callback, durationFn)` - Takes a callback function and a duration function that returns milliseconds. Returns a throttled function that can be called repeatedly but will only execute the callback at most once per duration interval.

## Example
```svelte
<script lang="ts">
	import { useThrottle } from "runed";

	let search = $state("");
	let throttledSearch = $state("");
	let durationMs = $state(1000);

	const throttledUpdate = useThrottle(
		() => {
			throttledSearch = search;
		},
		() => durationMs
	);
</script>

<div>
	<input
		bind:value={
			() => search,
			(v) => {
				search = v;
				throttledUpdate();
			}
		} />
	<p>You searched for: <b>{throttledSearch}</b></p>
</div>
```

In this example, the search input is throttled to update at most once per second (1000ms), preventing excessive updates while the user types.

### watch
watch: manually track specific reactive dependencies with callback receiving current/previous values; variants: watch.pre, watchOnce, watchOnce.pre; options: lazy

## watch

Manually specify which reactive values should trigger a callback, unlike `$effect` which automatically tracks all dependencies.

**Basic usage:**
```ts
import { watch } from "runed";
let count = $state(0);
watch(() => count, () => {
	console.log(count);
});
```

**Deep watching objects:**
```ts
let user = $state({ name: 'bob', age: 20 });
watch(() => $state.snapshot(user), () => {
	console.log(`${user.name} is ${user.age} years old`);
});
```

**Watching specific nested values:**
```ts
let user = $state({ name: 'bob', age: 20 });
watch(() => user.age, () => {
	console.log(`User is now ${user.age} years old`);
});
```

**Multiple sources as array:**
```ts
let age = $state(20);
let name = $state("bob");
watch([() => age, () => name], ([age, name], [prevAge, prevName]) => {
	// callback receives current and previous values
});
```

**Callback receives current and previous values:**
```ts
let count = $state(0);
watch(() => count, (curr, prev) => {
	console.log(`count is ${curr}, was ${prev}`);
});
```

**Options:**
- `lazy: true` - First run only happens after sources change (default: false)

**Variants:**
- `watch.pre` - Uses `$effect.pre` under the hood for pre-effect timing
- `watchOnce` / `watchOnce.pre` - Runs callback only once, no options object accepted

