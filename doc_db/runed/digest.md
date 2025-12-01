## Reactive DOM & State Utilities

**Element Tracking**
- `activeElement` - Reactive focused element with Shadow DOM support
- `ElementRect` - Reactive DOMRect tracking
- `ElementSize` - Reactive width/height tracking
- `IsFocusWithin` - Descendant focus tracking
- `IsInViewport` - Viewport visibility via Intersection Observer

**State Management**
- `Context` - Type-safe Svelte Context API wrapper
- `PersistedState` - Reactive state with browser storage persistence and cross-tab sync
- `Debounced` - Debounced state with `.current`, `.cancel()`, `.setImmediately()`
- `Throttled` - Throttled state with `.current`, `.cancel()`
- `Previous` - Tracks previous getter values
- `StateHistory` - Undo/redo with `undo()`, `redo()`, `canUndo`, `canRedo`

**Async & Timing**
- `resource` - Reactive async data fetcher with loading/error states, debounce/throttle, cleanup
- `AnimationFrames` - requestAnimationFrame wrapper with FPS limiting
- `useInterval` - Reactive setInterval with pause/resume
- `useDebounce` - Debounce callback with `pending`, `runScheduledNow()`
- `useThrottle` - Throttle callback execution

**Event & Observer Hooks**
- `useEventListener` - Auto-disposed event listener
- `useIntersectionObserver` - Intersection Observer with pause/resume/stop
- `useResizeObserver` - Resize Observer
- `useMutationObserver` - Mutation Observer
- `onClickOutside` - Detect clicks outside element
- `onCleanup` - Register cleanup on effect disposal

**User Interaction**
- `IsIdle` - Idle state tracking with configurable timeout
- `IsDocumentVisible` - Document visibility tracking
- `IsMounted` - Component mount state
- `PressedKeys` - Keyboard key press tracker
- `ScrollState` - Scroll position/direction tracking

**Geolocation & Search**
- `useGeolocation` - Reactive Geolocation API wrapper
- `useSearchParams` - Type-safe URL search params with compression and validation

**Utilities**
- `boolAttr` - Convert values to boolean HTML attributes
- `extract` - Resolve MaybeGetter<T> to plain value
- `FiniteStateMachine` - Strongly-typed FSM with lifecycle hooks
- `TextareaAutosize` - Auto-resize textarea
- `watch` - Manually track reactive dependencies

**Installation & Usage**
```bash
npm install runed
```

```svelte
<script lang="ts">
	import { activeElement } from "runed";
	let inputElement = $state<HTMLInputElement>();
</script>

<input bind:this={inputElement} />
{#if activeElement.current === inputElement}Active!{/if}
```