## Overview
Generated type definitions for routes and assets in your SvelteKit app. Available since v2.26.

```js
import type { RouteId, RouteParams, LayoutParams } from '$app/types';
```

## Asset
Union of all static directory filenames plus a string wildcard for dynamically imported assets.

```ts
type Asset = '/favicon.png' | '/robots.txt' | (string & {});
```

## RouteId
Union of all route IDs in the app. Used for `page.route.id` and `event.route.id`.

```ts
type RouteId = '/' | '/my-route' | '/my-other-route/[param]';
```

## Pathname
Union of all valid pathnames in the app.

```ts
type Pathname = '/' | '/my-route' | `/my-other-route/${string}` & {};
```

## ResolvedPathname
Like `Pathname` but prefixed with base path (if configured). Used for `page.url.pathname`.

```ts
type ResolvedPathname = `${'' | `/${string}`}/` | `${'' | `/${string}`}/my-route` | `${'' | `/${string}`}/my-other-route/${string}` | {};
```

## RouteParams
Utility to get parameters for a given route.

```ts
type RouteParams<T extends RouteId> = { /* generated */ } | Record<string, never>;

// Example
type BlogParams = RouteParams<'/blog/[slug]'>; // { slug: string }
```

## LayoutParams
Like `RouteParams` but includes optional parameters from child routes.

```ts
type RouteParams<T extends RouteId> = { /* generated */ } | Record<string, never>;
```