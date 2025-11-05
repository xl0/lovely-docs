## Generated Type Utilities

The `$app/types` module provides auto-generated TypeScript types for your app's routes and assets.

### Asset
Union of all static directory filenames plus a string wildcard for dynamically imported assets:
```ts
type Asset = '/favicon.png' | '/robots.txt' | (string & {});
```

### RouteId
Union of all route IDs in your app, used with `page.route.id` and `event.route.id`:
```ts
type RouteId = '/' | '/my-route' | '/my-other-route/[param]';
```

### Pathname
Union of all valid pathnames in your app:
```ts
type Pathname = '/' | '/my-route' | `/my-other-route/${string}` & {};
```

### ResolvedPathname
Like `Pathname` but includes base path prefix, used with `page.url.pathname`:
```ts
type ResolvedPathname = `${'' | `/${string}`}/` | `${'' | `/${string}`}/my-route` | `${'' | `/${string}`}/my-other-route/${string}` | {};
```

### RouteParams
Utility to get parameters for a given route:
```ts
type BlogParams = RouteParams<'/blog/[slug]'>; // { slug: string }
```

### LayoutParams
Like `RouteParams` but includes optional parameters from child routes.