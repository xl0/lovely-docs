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