## Generated Route and Asset Types

Auto-generated TypeScript utilities for type-safe route handling:

- **Asset**: Union of static files and dynamic imports
- **RouteId**: All route IDs in your app
- **Pathname**: All valid pathnames
- **ResolvedPathname**: Pathnames with base path prefix
- **RouteParams**: Get parameters for a route: `RouteParams<'/blog/[slug]'>` → `{ slug: string }`
- **LayoutParams**: Route parameters including optional child route params