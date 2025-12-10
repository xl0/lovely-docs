## Overview

Store-based equivalents of exports from `$app/state`. Deprecated in SvelteKit 2.12+ in favor of `$app/state` (requires Svelte 5).

```js
import { getStores, navigating, page, updated } from '$app/stores';
```

## getStores

Returns an object containing `page`, `navigating`, and `updated` stores.

```js
const { page, navigating, updated } = getStores();
```

## navigating

Readable store. Value is a `Navigation` object with `from`, `to`, `type`, and optionally `delta` (when `type === 'popstate'`) during navigation, reverts to `null` when finished.

Server: subscribe only during component initialization. Browser: subscribe anytime.

```ts
const navigating: Readable<Navigation | null>;
```

## page

Readable store containing page data.

Server: subscribe only during component initialization. Browser: subscribe anytime.

```ts
const page: Readable<Page>;
```

## updated

Readable store, initial value `false`. If `version.pollInterval` is non-zero, SvelteKit polls for new app versions and updates to `true` when detected. Has `check()` method to force immediate check.

Server: subscribe only during component initialization. Browser: subscribe anytime.

```ts
const updated: Readable<boolean> & { check(): Promise<boolean> };
```