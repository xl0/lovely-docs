## Reactive Utilities

**Element Tracking:** `activeElement`, `ElementRect`, `ElementSize`, `IsFocusWithin`, `IsInViewport`

**State Management:** `Context`, `PersistedState`, `Debounced`, `Throttled`, `Previous`, `StateHistory`

**Async & Timing:** `resource`, `AnimationFrames`, `useInterval`, `useDebounce`, `useThrottle`

**Event & Observers:** `useEventListener`, `useIntersectionObserver`, `useResizeObserver`, `useMutationObserver`, `onClickOutside`, `onCleanup`

**User Interaction:** `IsIdle`, `IsDocumentVisible`, `IsMounted`, `PressedKeys`, `ScrollState`

**Geolocation & Search:** `useGeolocation`, `useSearchParams`

**Utilities:** `boolAttr`, `extract`, `FiniteStateMachine`, `TextareaAutosize`, `watch`

```bash
npm install runed
```

```svelte
import { activeElement } from "runed";
{#if activeElement.current === inputElement}Active!{/if}
```