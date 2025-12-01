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