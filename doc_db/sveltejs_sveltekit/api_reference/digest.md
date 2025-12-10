## Complete API Reference

### Core Exports
Import from `@sveltejs/kit`: Server class, response helpers (error/fail/invalid/json/text/redirect), type guards (isActionFailure/isHttpError/isRedirect/isValidationError), normalizeUrl, VERSION.

### Response Helpers
- **error(status, body)** - Throws HTTP error, prevents handleError hook execution
- **fail(status, data?)** - Creates ActionFailure for form submission failures
- **invalid(...issues)** - Throws validation error in form actions with field-specific errors via `issue` helper
- **json(data, init?)** - Creates JSON Response
- **text(body, init?)** - Creates text Response
- **redirect(status, location)** - Redirects request (303 for GET after POST, 307/308 to keep method)
- **normalizeUrl(url)** - Strips SvelteKit suffixes and trailing slashes, returns {url, wasNormalized, denormalize}

### Form Actions
- **Action** - Single form action handler: `(event: RequestEvent) => MaybePromise<OutputData>`
- **Actions** - Multiple named actions in +page.server.js: `Record<string, Action>`
- **ActionFailure** - Result of fail(): `{status: number, data: T, [uniqueSymbol]: true}`
- **ActionResult** - Response from form action: success/failure/redirect/error types

### Load Functions
- **Load** - Generic load function: `(event: LoadEvent) => MaybePromise<OutputData>`
- **LoadEvent** - Extends NavigationEvent with: fetch (credentialed, relative URLs on server), data (from +layout.server.js), setHeaders(), parent(), depends(), untrack(), tracing
- **ServerLoad** - Server-only load function
- **ServerLoadEvent** - Extends RequestEvent with parent(), depends(), untrack(), tracing

### RequestEvent
Available in hooks and load functions:
```ts
interface RequestEvent {
  cookies: Cookies;
  fetch: typeof fetch;
  getClientAddress(): string;
  locals: App.Locals;
  params: Params;
  platform: App.Platform | undefined;
  request: Request;
  route: { id: RouteId };
  setHeaders(headers: Record<string, string>): void;
  url: URL;
  isDataRequest: boolean;
  isSubRequest: boolean;
  isRemoteRequest: boolean;
  tracing: { enabled: boolean; root: Span; current: Span };
}
```

### Cookies
```ts
interface Cookies {
  get(name: string, opts?: CookieParseOptions): string | undefined;
  getAll(opts?: CookieParseOptions): Array<{ name: string; value: string }>;
  set(name: string, value: string, opts: CookieSerializeOptions & { path: string }): void;
  delete(name: string, opts: CookieSerializeOptions & { path: string }): void;
  serialize(name: string, value: string, opts: CookieSerializeOptions & { path: string }): string;
}
```
httpOnly and secure default to true (except localhost where secure is false). sameSite defaults to lax. Must specify path.

### Navigation Types
- **Navigation** - Union of form/link/goto/popstate/external navigation
- **NavigationBase** - Common properties: from, to, willUnload, complete
- **NavigationTarget** - Target of navigation: params, route, url
- **NavigationType** - 'enter' | 'form' | 'leave' | 'link' | 'goto' | 'popstate'
- **BeforeNavigate** - Argument to beforeNavigate() hook with cancel() method
- **AfterNavigate** - Argument to afterNavigate() hook with type and willUnload: false
- **OnNavigate** - Argument to onNavigate() hook

### Page Store
```ts
interface Page<Params, RouteId> {
  url: URL & { pathname: ResolvedPathname };
  params: Params;
  route: { id: RouteId };
  status: number;
  error: App.Error | null;
  data: App.PageData & Record<string, any>;
  state: App.PageState;
  form: any;
}
```

### Hooks
- **Handle** - Runs on every request: `(input: {event, resolve}) => MaybePromise<Response>`
- **HandleFetch** - Intercepts event.fetch() calls
- **HandleServerError** - Handles unexpected server errors: `(input: {error, event, status, message}) => MaybePromise<void | App.Error>`
- **HandleClientError** - Handles unexpected client errors
- **HandleValidationError** - Handles remote function validation failures
- **Reroute** - Modifies URL before routing (v2.3.0+): `(event: {url, fetch}) => MaybePromise<void | string>`
- **Transport** - Custom type serialization: `Record<string, {encode(value): false | U, decode(data): T}>`
- **ClientInit** - Runs once app starts in browser (v2.10.0+)
- **ServerInit** - Runs before server responds to first request (v2.10.0+)

### Adapters
```ts
interface Adapter {
  name: string;
  adapt(builder: Builder): MaybePromise<void>;
  supports?: {
    read?(details: { config: any; route: { id: string } }): boolean;
    instrumentation?(): boolean;
  };
  emulate?(): MaybePromise<Emulator>;
}
```

**Builder** - Passed to adapt(): log, rimraf, mkdirp, config, prerendered, routes, createEntries, findServerAssets, generateFallback, generateEnvModule, generateManifest, getBuildDirectory, getClientDirectory, getServerDirectory, getAppPath, writeClient, writePrerendered, writeServer, copy, hasServerInstrumentationFile, instrument, compress

**Emulator** - Influences environment: `platform?(details: {config, prerender}): MaybePromise<App.Platform>`

**Prerendered** - Info about prerendered pages: pages, assets, redirects, paths

### Remote Functions
- **RemoteCommand** - Server function returning single value with pending property and updates() method
- **RemoteQuery** - Server function returning reactive value with set(), refresh(), withOverride()
- **RemoteForm** - Server form function with enhance(), for(), preflight(), validate(), result, pending, fields, buttonProps
- **RemoteResource** - Base for query/command results with error, loading, current, ready
- **RemoteFormField** - Form field accessor with as() method for element props
- **RemoteFormIssue** - Validation issue: {message, path}

### Error Types
- **HttpError** - From error(): `{status: 400-599, body: App.Error}`
- **Redirect** - From redirect(): `{status: 300|301|302|303|304|305|306|307|308, location}`
- **ValidationError** - From invalid(): `{issues: StandardSchemaV1.Issue[]}`

### Utilities
- **VERSION** - SvelteKit version string
- **ParamMatcher** - Custom route parameter validation: `(param: string) => boolean`
- **ResolveOptions** - Options for resolve() in handle hook: transformPageChunk, filterSerializedResponseHeaders, preload
- **RouteDefinition** - Route metadata: id, api, page, pattern, prerender, segments, methods, config
- **SSRManifest** - Server-side manifest with appDir, appPath, assets, mimeTypes, internal metadata
- **InvalidField** - Imperative validation error builder for field-specific issues
- **CspDirectives** - Content Security Policy directives with typed sources
- **MaybePromise<T>** - T | Promise<T>
- **TrailingSlash** - 'never' | 'always' | 'ignore'
- **PrerenderOption** - boolean | 'auto'
- **HttpMethod** - 'GET' | 'HEAD' | 'POST' | 'PUT' | 'DELETE' | 'PATCH' | 'OPTIONS'

### Additional Utilities
- **sequence()** - Chains handle hooks with different ordering: transformPageChunk reversed, preload/filterSerializedResponseHeaders forward with first-wins
- **installPolyfills()** - Makes web APIs (crypto, File) available as globals in Node.js
- **createReadableStream(path)** - Converts file to readable stream
- **getRequest({request, base, bodySizeLimit})** - Converts Node.js IncomingMessage to Fetch Request
- **setResponse(res, response)** - Writes Fetch Response to Node.js ServerResponse
- **sveltekit()** - Returns array of Vite plugins

### Environment Modules
- **$app/environment** - browser, building, dev, version constants
- **$app/forms** - applyAction, deserialize, enhance for form handling
- **$app/navigation** - afterNavigate, beforeNavigate, disableScrollHandling, goto, invalidate, invalidateAll, onNavigate, preloadCode, preloadData, pushState, replaceState, refreshAll
- **$app/paths** - asset(), resolve() for URL resolution; deprecated assets, base, resolveRoute
- **$app/server** - command, form, getRequestEvent, prerender, query, read for server functions
- **$app/state** - navigating, page, updated reactive state objects
- **$app/stores** - Deprecated store-based API (use $app/state instead)
- **$app/types** - Auto-generated types: Asset, RouteId, Pathname, ResolvedPathname, RouteParams, LayoutParams
- **$env/dynamic/private** - Runtime private environment variables
- **$env/dynamic/public** - Runtime public environment variables (PUBLIC_ prefix)
- **$env/static/private** - Build-time private environment variables
- **$env/static/public** - Build-time public environment variables
- **$lib** - Auto-configured alias to src/lib
- **$service-worker** - Service worker metadata: base, build, files, prerendered, version

### Configuration (svelte.config.js)
- **adapter** - Converts build for deployment
- **alias** - Import alias mappings
- **appDir** - Directory for SvelteKit assets (default: "_app")
- **csp** - Content Security Policy with mode (hash/nonce/auto), directives, reportOnly
- **csrf** - CSRF protection with checkOrigin, trustedOrigins
- **embedded** - Whether app is embedded in larger app
- **env** - Environment variable config: dir, publicPrefix, privatePrefix
- **experimental** - Experimental features: tracing, instrumentation, remoteFunctions
- **inlineStyleThreshold** - Max CSS length to inline in HTML head
- **moduleExtensions** - File extensions treated as modules (default: [".js", ".ts"])
- **outDir** - Build output directory (default: ".svelte-kit")
- **output** - Build format: preloadStrategy (modulepreload/preload-js/preload-mjs), bundleStrategy (split/single/inline)
- **paths** - URL paths: assets, base, relative
- **prerender** - Prerendering: concurrency, crawl, entries, handleHttpError, handleMissingId, handleEntryGeneratorMismatch, handleUnseenRoutes, origin
- **router** - Client router: type (pathname/hash), resolution (client/server)
- **typescript** - TypeScript config function
- **version** - Version management: name, pollInterval

### CLI
- **vite dev** - Start development server
- **vite build** - Build production version
- **vite preview** - Run production build locally
- **svelte-kit sync** - Generate tsconfig.json and type definitions

### Generated Types
SvelteKit auto-generates `.d.ts` files for each route with RouteParams, RequestHandler, PageLoad, PageData, LayoutData, ActionData, PageProps, LayoutProps types. Generated in `.svelte-kit/types/src/routes/[params]/$types.d.ts`. tsconfig.json must extend `.svelte-kit/tsconfig.json`.

### App Namespace (app.d.ts)
- **App.Error** - Shape of expected/unexpected errors
- **App.Locals** - Shape of event.locals
- **App.PageData** - Shape of page.data
- **App.PageState** - Shape of page.state
- **App.Platform** - Adapter-specific platform context