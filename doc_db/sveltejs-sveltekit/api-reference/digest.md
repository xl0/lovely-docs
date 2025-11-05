## Core Response & Error Handling
- `json(data)`, `text(body)` - Create responses
- `error(status, body)`, `redirect(status, location)`, `fail(status, data)` - Throw errors/redirects
- `isHttpError()`, `isRedirect()`, `isActionFailure()` - Type guards

## Request & Page Types
- **RequestEvent**: `cookies`, `fetch`, `locals`, `params`, `url`, `setHeaders()`, `getClientAddress()`
- **LoadEvent**: Extends RequestEvent, adds `data`, `parent()`, `depends()`, `untrack()`
- **Page**: `url`, `params`, `route.id`, `status`, `error`, `data`, `state`, `form`
- **ActionResult**: `{type: 'success'|'failure'|'redirect'|'error', ...}`

## Hooks
- **handle**: `(input: {event, resolve}) => Response`
- **handleError**: `(input: {error, event, status, message}) => App.Error`
- **handleFetch**: `(input: {event, request, fetch}) => Response`
- **reroute**: `(event: {url, fetch}) => void | string`
- **sequence**: Chain multiple handle middleware with specific ordering

## Forms & Navigation
- **enhance**: Intercept form submissions, prevent default, update form state
- **applyAction**: Update `form` property and `page.status`
- **deserialize**: Deserialize form submission responses
- **goto(url, opts)**: Programmatic navigation with `replaceState`, `noScroll`, `keepFocus`, `invalidateAll`
- **invalidate(resource)**: Re-run load functions for resource
- **beforeNavigate/afterNavigate**: Navigation lifecycle hooks
- **preloadData(href)**: Preload page code and load functions

## Environment & Configuration
- **$app/environment**: `browser`, `building`, `dev`, `version` constants
- **$env/static/private**: Build-time private variables
- **$env/static/public**: Build-time public variables (PUBLIC_ prefix)
- **$env/dynamic/private**: Runtime private variables (server-only)
- **$env/dynamic/public**: Runtime public variables (PUBLIC_ prefix)
- **$app/state**: `navigating`, `page`, `updated` read-only state objects
- **$app/paths**: `asset(file)`, `resolve(pathname, params?)` - Path resolution with base path handling

## Cookies & Server
- `get(name)`, `getAll()`, `set(name, value, opts)`, `delete(name, opts)` - `path` required, `httpOnly`/`secure` default true
- **$app/server**: `command`, `form`, `query`, `query.batch`, `prerender`, `read` - Remote functions and asset reading
- **getRequestEvent**: Access current RequestEvent in server context

## Adapter & Build
- **Builder**: `log`, `rimraf`, `mkdirp`, `config`, `routes`, `writeClient()`, `writeServer()`, `generateManifest()`, `compress()`
- **Node utilities**: `createReadableStream(file)`, `getRequest({request, base, bodySizeLimit})`, `setResponse(res, response)`
- **installPolyfills()**: Install web API polyfills for Node.js

## Configuration (svelte.config.js)
- **adapter** - Platform output converter (required)
- **csp** - Content Security Policy with mode ('hash'|'nonce'|'auto')
- **csrf** - CSRF protection: checkOrigin, trustedOrigins
- **paths** - URL config: assets (CDN), base, relative
- **prerender** - concurrency, crawl, entries, origin
- **router.type** - 'pathname' (default) or 'hash'
- **version** - name, pollInterval

## Types
- **$types**: Auto-generated typed `RequestHandler`, `Load` functions, `PageData`, `LayoutData`, `ActionData`
- **$app/types**: `RouteId`, `Pathname`, `RouteParams<'/blog/[slug]'>`, `LayoutParams`
- **app.d.ts**: Ambient types for `Error`, `Locals`, `PageData`, `PageState`, `Platform`

## Service Worker
- **$service-worker**: `base`, `build`, `files`, `prerendered`, `version` constants for cache management