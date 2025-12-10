## Generated Type Utilities
Auto-generated types for routes and assets in your app (v2.26+).

- **Asset**: Union of static files + dynamic imports
- **RouteId**: All route IDs in app
- **Pathname**: Valid pathnames
- **ResolvedPathname**: Pathnames with base path prefix
- **RouteParams<T>**: Get parameters for route `T` (e.g., `RouteParams<'/blog/[slug]'>` → `{ slug: string }`)
- **LayoutParams**: Like RouteParams but includes child route optional params