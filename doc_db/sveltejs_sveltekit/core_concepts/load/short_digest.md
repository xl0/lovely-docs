## Load functions

`+page.js` exports `load` function returning data available via `data` prop. Runs on server and browser. Use `+page.server.js` for server-only (database, private env vars).

`+layout.js`/`+layout.server.js` load data available to layout and child routes. Data merged with last key winning.

## Universal vs server

**Universal** (`+page.js`, `+layout.js`): Run server+browser, return any values, use for external APIs.
**Server** (`+page.server.js`, `+layout.server.js`): Server-only, return serializable data, use for databases/private credentials.

## URL data

Load receives `url` (URL instance), `route` (route id), `params` (parsed from pathname).

## Fetch

Use provided `fetch` function: credentialed on server, relative requests, internal requests skip HTTP, response inlined during SSR and reused during hydration.

## Headers & cookies

`setHeaders()` sets response headers (server-only). Cookies passed through `fetch` only to same host or subdomains.

## Parent data

`await parent()` accesses parent load data. Avoid waterfalls by calling non-dependent operations first.

## Errors & redirects

Throw `error(status, message)` or `redirect(status, url)` to handle errors/redirects.

## Streaming

Server load functions stream unresolved promises to browser. Attach noop-catch to prevent crashes.

## Rerunning

Load reruns when `params`/`url` changes, `parent()` reruns, or `invalidate(url)`/`invalidateAll()` called. Use `untrack()` to exclude from tracking.

## Authentication

Use hooks for multi-route protection or auth guards in `+page.server.js`. Auth in `+layout.server.js` requires child pages to `await parent()`.

## getRequestEvent

`getRequestEvent()` retrieves `event` in server load for shared auth logic.