The `$app/environment` module exports four constants for runtime environment detection:

- `browser: boolean` - True when the app is running in the browser (false on server)
- `building: boolean` - True during the build step and prerendering when SvelteKit analyzes your app
- `dev: boolean` - True when the dev server is running (not guaranteed to match NODE_ENV or MODE)
- `version: string` - The value of `config.kit.version.name`

Example usage:
```js
import { browser, building, dev, version } from '$app/environment';

if (browser) {
  // Browser-only code
}

if (building) {
  // Build/prerender-only code
}

if (dev) {
  // Dev server code
}

console.log(version); // e.g., "1.0.0"
```