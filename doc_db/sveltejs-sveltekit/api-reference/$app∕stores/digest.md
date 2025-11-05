## Deprecated Store-Based API

This module provides store equivalents of `$app/state` exports. **Deprecated in SvelteKit 2.12+** — use `$app/state` instead (requires Svelte 5).

### getStores()
Returns an object containing `page`, `navigating`, and `updated` stores.

### navigating
Readable store that contains a `Navigation` object (with `from`, `to`, `type`, and optional `delta` properties) while navigation is in progress, then reverts to `null`. Server-side subscription only during component initialization; browser allows subscription anytime.

### page
Readable store containing page data. Server-side subscription only during component initialization; browser allows subscription anytime.

### updated
Readable store (initially `false`) that updates to `true` when a new app version is detected via polling (if `version.pollInterval` is non-zero). Includes `check()` method to force immediate version check. Server-side subscription only during component initialization; browser allows subscription anytime.