## Core Functions
- `json(data)`, `text(body)`, `error(status, body)`, `redirect(status, location)`, `fail(status, data)`
- Type guards: `isHttpError()`, `isRedirect()`, `isActionFailure()`

## Key Types
- **RequestEvent**: `cookies`, `fetch`, `locals`, `params`, `url`, `setHeaders()`, `getClientAddress()`
- **LoadEvent**: Extends RequestEvent, adds `data`, `parent()`, `depends()`, `untrack()`
- **Page**: `url`, `params`, `route.id`, `status`, `error`, `data`, `state`, `form`

## Hooks
- **handle**: `(input: {event, resolve}) => Response`
- **handleError**, **handleFetch**, **reroute**
- **sequence**: Chain multiple handle middleware

## Forms & Navigation
- **enhance**: Intercept form submissions without JavaScript
- **goto(url, opts)**: Programmatic navigation
- **invalidate(resource)**: Re-run load functions
- **beforeNavigate/afterNavigate**: Navigation lifecycle
- **preloadData(href)**: Preload page code and load functions

## Environment
- **$app/environment**: `browser`, `building`, `dev`, `version`
- **$env/static/private**, **$env/static/public**: Build-time variables
- **$env/dynamic/private**, **$env/dynamic/public**: Runtime variables
- **$app/state**: `navigating`, `page`, `updated` read-only objects

## Configuration (svelte.config.js)
- **adapter**, **csp**, **csrf**, **paths**, **prerender**, **router.type**, **version**

## Types
- **$types**: Auto-generated typed handlers and data types
- **$app/types**: `RouteId`, `Pathname`, `RouteParams<'/blog/[slug]'>`
- **app.d.ts**: Ambient types for `Error`, `Locals`, `PageData`, `PageState`