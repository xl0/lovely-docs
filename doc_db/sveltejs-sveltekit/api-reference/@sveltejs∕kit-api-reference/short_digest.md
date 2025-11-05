## Core Functions
- `json(data)`, `text(body)` - Create responses
- `error(status, body)`, `redirect(status, location)`, `fail(status, data)` - Throw errors/redirects
- `isHttpError()`, `isRedirect()`, `isActionFailure()` - Type guards
- `normalizeUrl(url)` - Strip SvelteKit suffixes

## Key Types
- **RequestEvent**: `cookies`, `fetch`, `locals`, `params`, `url`, `setHeaders()`, `getClientAddress()`
- **LoadEvent**: Extends RequestEvent, adds `data`, `parent()`, `depends()`, `untrack()`
- **Page**: `url`, `params`, `route.id`, `status`, `error`, `data`, `state`, `form`
- **ActionResult**: `{type: 'success'|'failure'|'redirect'|'error', ...}`

## Hooks
- **handle**: `(input: {event, resolve}) => Response`
- **handleError**: `(input: {error, event, status, message}) => App.Error`
- **handleFetch**: `(input: {event, request, fetch}) => Response`
- **reroute**: `(event: {url, fetch}) => void | string`

## Adapter
- **Builder**: `log`, `rimraf`, `mkdirp`, `config`, `routes`, `writeClient()`, `writeServer()`, `generateManifest()`, `compress()`

## Remote Functions
- **RemoteCommand**: `(arg) => Promise` with `pending`, `updates()`
- **RemoteForm**: `{action, enhance(), fields, result, pending}`
- **RemoteQuery**: Promise-like with `current`, `ready`, `loading`, `error`, `set()`, `refresh()`

## Cookies
- `get(name)`, `getAll()`, `set(name, value, opts)`, `delete(name, opts)` - `path` required, `httpOnly`/`secure` default true