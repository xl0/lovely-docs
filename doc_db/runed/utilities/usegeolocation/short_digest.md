Reactive wrapper for browser Geolocation API. Returns `position` (coords, timestamp), `error`, `isSupported`, `isPaused`, and `pause()`/`resume()` methods. Accepts `immediate` option (default true) and standard PositionOptions.

```svelte
const location = useGeolocation();
// Access: location.position.coords, location.error, location.isSupported
// Control: location.pause(), location.resume()
```