## Core Exports

**Server class**: Handles SSR with `constructor(manifest)`, `init(options)`, and `respond(request, options)` methods.

**Response helpers**:
- `json(data, init?)` - Create JSON Response
- `text(body, init?)` - Create text Response
- `error(status, body)` - Throw HTTP error (prevents handleError hook)
- `redirect(status, location)` - Throw redirect (status 300-308)
- `fail(status, data?)` - Create ActionFailure for form handlers

**Type guards**:
- `isHttpError(e, status?)` - Check if error thrown by error()
- `isRedirect(e)` - Check if redirect thrown by redirect()
- `isActionFailure(e)` - Check if failure thrown by fail()

**Utilities**:
- `normalizeUrl(url)` - Strip SvelteKit suffixes and trailing slashes, returns `{url, wasNormalized, denormalize}`
- `VERSION` - Package version string

## Request/Response Types

**RequestEvent**: Available in load functions, actions, and handle hook. Contains `cookies`, `fetch`, `locals`, `params`, `platform`, `request`, `url`, `setHeaders()`, `getClientAddress()`, `isDataRequest`, `isSubRequest`, `isRemoteRequest`, `tracing`.

**LoadEvent**: Extends RequestEvent, adds `data` (from server load), `parent()` (parent layout data), `depends()`, `untrack()`.

**Page**: Reactive object with `url`, `params`, `route.id`, `status`, `error`, `data`, `state`, `form`.

## Form Actions

**Action**: `(event: RequestEvent) => MaybePromise<OutputData>`

**ActionResult**: Union of `{type: 'success', status, data}`, `{type: 'failure', status, data}`, `{type: 'redirect', status, location}`, `{type: 'error', status?, error}`.

**ActionFailure**: `{status, data, [uniqueSymbol]: true}`

## Navigation Types

**Navigation**: Union of NavigationExternal, NavigationFormSubmit, NavigationPopState, NavigationLink. Each has `from`, `to`, `willUnload`, `complete` promise.

**NavigationType**: 'enter' | 'form' | 'leave' | 'link' | 'goto' | 'popstate'

**AfterNavigate**: Navigation with `type` (excludes 'leave') and `willUnload: false`.

**BeforeNavigate**: Navigation with `cancel()` method.

## Hooks

**Handle**: `(input: {event, resolve}) => Response` - Runs on every request, can modify response.

**HandleError** (server/client): `(input: {error, event, status, message}) => App.Error | void`

**HandleFetch**: `(input: {event, request, fetch}) => Response` - Intercept fetch calls.

**HandleValidationError**: `(input: {issues, event}) => App.Error` - Handle validation failures.

**Reroute**: `(event: {url, fetch}) => void | string` - Modify URL before routing.

**Transport**: Custom type serialization across server/client boundary with `encode`/`decode` functions.

## Adapter Interface

**Adapter**: `{name, adapt(builder), supports?, emulate?}`

**Builder**: Provides `log`, `rimraf`, `mkdirp`, `config`, `prerendered`, `routes`, `writeClient()`, `writeServer()`, `writePrerendered()`, `copy()`, `generateManifest()`, `generateFallback()`, `getClientDirectory()`, `getServerDirectory()`, `getAppPath()`, `findServerAssets()`, `compress()`, `instrument()`, `hasServerInstrumentationFile()`.

## Remote Functions

**RemoteCommand**: `(arg: Input) => Promise<Output>` with `pending` getter and `updates(...queries)` method.

**RemoteForm**: Form object with `method: 'POST'`, `action`, `enhance()`, `for(id)`, `preflight()`, `validate()`, `result` getter, `pending` getter, `fields`, `buttonProps`.

**RemoteQuery**: Promise-like with `current` getter, `ready` boolean, `loading` getter, `error` getter, `set()`, `refresh()`, `withOverride()`.

## Cookies API

**Cookies**: `get(name, opts?)`, `getAll(opts?)`, `set(name, value, opts)`, `delete(name, opts)`, `serialize(name, value, opts)`. Options passed to cookie library. `httpOnly` and `secure` default to true (except localhost), `sameSite` defaults to 'lax', `path` is required.

## Configuration & Validation

**Invalid**: Proxy object for creating validation errors. Call `invalid(issue1, issue2)` or `invalid.fieldName('message')` for field-specific errors.

**CspDirectives**: Content Security Policy configuration with directives like 'script-src', 'style-src', 'img-src', etc.

**Prerendered**: `{pages: Map, assets: Map, redirects: Map, paths: string[]}`