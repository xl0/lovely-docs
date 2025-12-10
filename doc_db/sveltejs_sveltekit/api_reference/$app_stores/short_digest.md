## $app/stores (Deprecated)

Store-based API for `navigating`, `page`, and `updated` — use `$app/state` instead (SvelteKit 2.12+).

- **navigating**: `Readable<Navigation | null>` — active navigation object or null
- **page**: `Readable<Page>` — page data
- **updated**: `Readable<boolean> & { check() }` — app version change detection
- **getStores()**: returns all three stores

Server subscriptions only during init; browser anytime.