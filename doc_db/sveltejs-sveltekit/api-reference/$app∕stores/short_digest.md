## Deprecated $app/stores API

Store-based equivalents of `$app/state` (use `$app/state` instead in SvelteKit 2.12+).

- **getStores()** — returns object with `page`, `navigating`, `updated` stores
- **navigating** — Readable store with Navigation object during navigation, null otherwise
- **page** — Readable store with page data
- **updated** — Readable store (boolean) with `check()` method for version polling