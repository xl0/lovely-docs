## Reactive DOM & State Utilities

**Element Tracking**
- `activeElement` - Reactive access to focused element with Shadow DOM support
- `ElementRect` - Reactive DOMRect tracking with individual property accessors
- `ElementSize` - Reactive width/height tracking
- `IsFocusWithin` - Tracks if any descendant has focus
- `IsInViewport` - Viewport visibility detection via Intersection Observer

**State Management**
- `Context` - Type-safe Svelte Context API wrapper with get/set/exists
- `PersistedState` - Reactive state with automatic browser storage persistence and cross-tab sync
- `Debounced` - Debounced state wrapper with `.current`, `.cancel()`, `.setImmediately()`, `.updateImmediately()`
- `Throttled` - Throttled state wrapper with `.current`, `.cancel()`, `.setImmediately()`
- `Previous` - Tracks previous getter values for state comparisons
- `StateHistory` - Undo/redo with `undo()`, `redo()`, `clear()`, `canUndo`, `canRedo`

**Async & Timing**
- `resource` - Reactive async data fetcher with loading/error states, debounce/throttle, cleanup hooks, pre-render support
- `AnimationFrames` - Declarative requestAnimationFrame wrapper with FPS limiting and frame metrics
- `useInterval` - Reactive setInterval with pause/resume and tick counter
- `useDebounce` - Debounce callback with `pending`, `runScheduledNow()`, `cancel()`
- `useThrottle` - Throttle callback execution to once per interval

**Event & Observer Hooks**
- `useEventListener` - Auto-disposed event listener with automatic cleanup
- `useIntersectionObserver` - Intersection Observer with pause/resume/stop control
- `useResizeObserver` - Resize Observer with stop control
- `useMutationObserver` - Mutation Observer with stop control
- `onClickOutside` - Detect clicks outside element with start/stop/enabled control
- `onCleanup` - Register cleanup function on effect disposal

**User Interaction**
- `IsIdle` - Idle state tracking with configurable timeout and events
- `IsDocumentVisible` - Document visibility tracking via Page Visibility API
- `IsMounted` - Component mount state tracking
- `PressedKeys` - Keyboard key press tracker with `has()`, `all`, `onKeys()`
- `ScrollState` - Scroll position/direction tracking with edge detection and programmatic scrolling

**Geolocation & Search**
- `useGeolocation` - Reactive Geolocation API wrapper with pause/resume
- `useSearchParams` - Type-safe, schema-validated URL search params with compression, debouncing, custom codecs

**Utilities**
- `boolAttr` - Convert values to `""` or `undefined` for HTML boolean attributes
- `extract` - Resolve MaybeGetter<T> to plain value with optional fallback
- `FiniteStateMachine` - Strongly-typed FSM with state/event config, lifecycle hooks, wildcard fallback, debounced transitions
- `TextareaAutosize` - Auto-resize textarea by measuring off-screen clone
- `watch` - Manually track specific reactive dependencies with callback; variants: `watch.pre`, `watchOnce`