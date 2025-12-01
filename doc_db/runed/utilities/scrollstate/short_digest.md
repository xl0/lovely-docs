## ScrollState

Reactive utility for tracking scroll position, direction, and edge states with programmatic scrolling support.

**Core API:**
- `scroll.x`, `scroll.y` — current positions (reactive, get/set)
- `scroll.directions` — active directions (left, right, top, bottom)
- `scroll.arrived` — edge reached states
- `scroll.progress` — scroll percentage on each axis
- `scroll.scrollTo(x, y)`, `scroll.scrollToTop()`, `scroll.scrollToBottom()` — programmatic control

**Configuration:**
```svelte
const scroll = new ScrollState({
	element: () => el,
	idle: 200,
	offset: { top: 50, bottom: 50 },
	behavior: "smooth",
	onScroll: (e) => {},
	onStop: (e) => {}
});
```

Supports window, document, and DOM elements; respects RTL and flex layouts.