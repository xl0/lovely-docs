

## Pages

### api_reference
Complete API reference for @sveltejs/kit: Server class, response helpers (error/fail/invalid/json/text/redirect), type guards, form actions, load functions, RequestEvent, Cookies, Navigation types, Page store, hooks (Handle/HandleFetch/HandleServerError/HandleClientError/HandleValidationError/Reroute/Transport/ClientInit/ServerInit), Adapter/Builder interfaces, remote functions (RemoteCommand/RemoteQuery/RemoteForm), error types, and utility types.

## Imports

```js
import {
	Server, VERSION, error, fail, invalid, isActionFailure, isHttpError,
	isRedirect, isValidationError, json, normalizeUrl, redirect, text
} from '@sveltejs/kit';
```

## Server Class

```ts
class Server {
	constructor(manifest: SSRManifest);
	init(options: ServerInitOptions): Promise<void>;
	respond(request: Request, options: RequestOptions): Promise<Response>;
}
```

## Response Helpers

**error(status, body)** - Throws HTTP error, prevents `handleError` hook execution. Don't catch it.

**fail(status, data?)** - Creates `ActionFailure` for form submission failures.

**invalid(...issues)** - Throws validation error imperatively in form actions. Can combine with `issue` for field-specific errors:
```ts
import { invalid } from '@sveltejs/kit';
import { form } from '$app/server';
import * as v from 'valibot';

export const login = form(
	v.object({ name: v.string(), _password: v.string() }),
	async ({ name, _password }) => {
		if (!tryLogin(name, _password)) {
			invalid('Incorrect username or password');
		}
	}
);
```

**json(data, init?)** - Creates JSON Response.

**text(body, init?)** - Creates text Response.

**redirect(status, location)** - Redirects request. Status codes: 303 (GET after POST), 307/308 (keep method). Don't catch it.

**normalizeUrl(url)** - Strips SvelteKit suffixes and trailing slashes:
```ts
const { url, wasNormalized, denormalize } = normalizeUrl('/blog/post/__data.json');
console.log(url.pathname); // /blog/post
console.log(denormalize('/blog/post/a')); // /blog/post/a/__data.json
```

## Type Guards

- **isActionFailure(e)** - Checks if error is from `fail()`.
- **isHttpError(e, status?)** - Checks if error is from `error()`.
- **isRedirect(e)** - Checks if error is from `redirect()`.
- **isValidationError(e)** - Checks if error is from `invalid()`.

## Form Actions

**Action** - Single form action handler:
```ts
type Action<Params, OutputData, RouteId> = 
	(event: RequestEvent<Params, RouteId>) => MaybePromise<OutputData>;
```

**Actions** - Multiple named actions in `+page.server.js`:
```ts
type Actions<Params, OutputData, RouteId> = 
	Record<string, Action<Params, OutputData, RouteId>>;
```

**ActionFailure** - Result of `fail()`:
```ts
interface ActionFailure<T = undefined> {
	status: number;
	data: T;
	[uniqueSymbol]: true;
}
```

**ActionResult** - Response from form action via fetch:
```ts
type ActionResult<Success, Failure> =
	| { type: 'success'; status: number; data?: Success }
	| { type: 'failure'; status: number; data?: Failure }
	| { type: 'redirect'; status: number; location: string }
	| { type: 'error'; status?: number; error: any };
```

## Load Functions

**Load** - Generic load function type (use generated types from `./$types` instead):
```ts
type Load<Params, InputData, ParentData, OutputData, RouteId> = 
	(event: LoadEvent<Params, InputData, ParentData, RouteId>) => MaybePromise<OutputData>;
```

**LoadEvent** - Event passed to load functions:
```ts
interface LoadEvent<Params, Data, ParentData, RouteId> extends NavigationEvent {
	fetch: typeof fetch; // Credentialed, relative URLs on server, internal requests bypass HTTP
	data: Data; // From +layout.server.js or +page.server.js
	setHeaders(headers: Record<string, string>): void; // Cache headers, etc
	parent(): Promise<ParentData>; // Data from parent layouts
	depends(...deps: string[]): void; // Declare dependencies for invalidate()
	untrack<T>(fn: () => T): T; // Opt out of dependency tracking
	tracing: { enabled: boolean; root: Span; current: Span }; // v2.31.0+
}
```

**ServerLoad** - Server-only load function (use generated types instead):
```ts
type ServerLoad<Params, ParentData, OutputData, RouteId> = 
	(event: ServerLoadEvent<Params, ParentData, RouteId>) => MaybePromise<OutputData>;
```

**ServerLoadEvent** - Extends RequestEvent with `parent()`, `depends()`, `untrack()`, `tracing`.

## Request/Response

**RequestEvent** - Event in hooks and load functions:
```ts
interface RequestEvent<Params, RouteId> {
	cookies: Cookies; // Get/set cookies
	fetch: typeof fetch; // Enhanced fetch
	getClientAddress(): string; // Client IP
	locals: App.Locals; // Custom data from handle hook
	params: Params; // Route parameters
	platform: App.Platform | undefined; // Adapter-specific data
	request: Request; // Original request
	route: { id: RouteId }; // Current route ID
	setHeaders(headers: Record<string, string>): void;
	url: URL; // Requested URL
	isDataRequest: boolean; // true for +page/layout.server.js data requests
	isSubRequest: boolean; // true for internal +server.js calls
	isRemoteRequest: boolean; // true for remote function calls
	tracing: { enabled: boolean; root: Span; current: Span }; // v2.31.0+
}
```

**RequestHandler** - Handler for +server.js (GET, POST, etc):
```ts
type RequestHandler<Params, RouteId> = 
	(event: RequestEvent<Params, RouteId>) => MaybePromise<Response>;
```

**Cookies** - Cookie management:
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

## Navigation

**Navigation** - Union of navigation types (form, link, goto, popstate, external).

**NavigationBase** - Common navigation properties:
```ts
interface NavigationBase {
	from: NavigationTarget | null;
	to: NavigationTarget | null;
	willUnload: boolean;
	complete: Promise<void>;
}
```

**NavigationTarget** - Target of navigation:
```ts
interface NavigationTarget<Params, RouteId> {
	params: Params | null;
	route: { id: RouteId | null };
	url: URL;
}
```

**NavigationType** - 'enter' | 'form' | 'leave' | 'link' | 'goto' | 'popstate'

**BeforeNavigate** - Argument to `beforeNavigate()` hook. Has `cancel()` method.

**AfterNavigate** - Argument to `afterNavigate()` hook. Has `type` and `willUnload: false`.

**OnNavigate** - Argument to `onNavigate()` hook. Has `type` (excludes 'enter'/'leave') and `willUnload: false`.

## Page State

**Page** - Shape of `$page` store:
```ts
interface Page<Params, RouteId> {
	url: URL & { pathname: ResolvedPathname };
	params: Params;
	route: { id: RouteId };
	status: number;
	error: App.Error | null;
	data: App.PageData & Record<string, any>;
	state: App.PageState; // Manipulated via pushState/replaceState
	form: any; // After form submission
}
```

**Snapshot** - Preserve component state across navigation:
```ts
interface Snapshot<T = any> {
	capture(): T;
	restore(snapshot: T): void;
}
```

## Hooks

**Handle** - Runs on every request:
```ts
type Handle = (input: {
	event: RequestEvent;
	resolve(event: RequestEvent, opts?: ResolveOptions): MaybePromise<Response>;
}) => MaybePromise<Response>;
```

**HandleFetch** - Intercepts `event.fetch()` calls:
```ts
type HandleFetch = (input: {
	event: RequestEvent;
	request: Request;
	fetch: typeof fetch;
}) => MaybePromise<Response>;
```

**HandleServerError** - Handles unexpected server errors:
```ts
type HandleServerError = (input: {
	error: unknown;
	event: RequestEvent;
	status: number;
	message: string;
}) => MaybePromise<void | App.Error>;
```

**HandleClientError** - Handles unexpected client errors:
```ts
type HandleClientError = (input: {
	error: unknown;
	event: NavigationEvent;
	status: number;
	message: string;
}) => MaybePromise<void | App.Error>;
```

**HandleValidationError** - Handles remote function validation failures:
```ts
type HandleValidationError<Issue> = (input: {
	issues: Issue[];
	event: RequestEvent;
}) => MaybePromise<App.Error>;
```

**Reroute** - Modifies URL before routing (v2.3.0+):
```ts
type Reroute = (event: {
	url: URL;
	fetch: typeof fetch;
}) => MaybePromise<void | string>;
```

**Transport** - Custom type serialization across server/client:
```ts
type Transport = Record<string, Transporter>;
interface Transporter<T, U> {
	encode(value: T): false | U;
	decode(data: U): T;
}
```

Example:
```ts
export const transport: Transport = {
	MyCustomType: {
		encode: (value) => value instanceof MyCustomType && [value.data],
		decode: ([data]) => new MyCustomType(data)
	}
};
```

**ClientInit** - Runs once app starts in browser (v2.10.0+):
```ts
type ClientInit = () => MaybePromise<void>;
```

**ServerInit** - Runs before server responds to first request (v2.10.0+):
```ts
type ServerInit = () => MaybePromise<void>;
```

## Adapters

**Adapter** - Turns production build into deployable artifact:
```ts
interface Adapter {
	name: string;
	adapt(builder: Builder): MaybePromise<void>;
	supports?: {
		read?(details: { config: any; route: { id: string } }): boolean;
		instrumentation?(): boolean; // v2.31.0+
	};
	emulate?(): MaybePromise<Emulator>;
}
```

**Builder** - Passed to adapter's `adapt()` function:
```ts
interface Builder {
	log: Logger;
	rimraf(dir: string): void;
	mkdirp(dir: string): void;
	config: ValidatedConfig;
	prerendered: Prerendered;
	routes: RouteDefinition[];
	createEntries(fn: (route: RouteDefinition) => AdapterEntry): Promise<void>; // deprecated
	findServerAssets(routes: RouteDefinition[]): string[];
	generateFallback(dest: string): Promise<void>;
	generateEnvModule(): void;
	generateManifest(opts: { relativePath: string; routes?: RouteDefinition[] }): string;
	getBuildDirectory(name: string): string;
	getClientDirectory(): string;
	getServerDirectory(): string;
	getAppPath(): string;
	writeClient(dest: string): string[];
	writePrerendered(dest: string): string[];
	writeServer(dest: string): string[];
	copy(from: string, to: string, opts?: { filter?(basename: string): boolean; replace?: Record<string, string> }): string[];
	hasServerInstrumentationFile(): boolean; // v2.31.0+
	instrument(args: { entrypoint: string; instrumentation: string; start?: string; module?: ... }): void; // v2.31.0+
	compress(directory: string): Promise<void>;
}
```

**Emulator** - Influences environment during dev/build/prerendering:
```ts
interface Emulator {
	platform?(details: { config: any; prerender: PrerenderOption }): MaybePromise<App.Platform>;
}
```

**Prerendered** - Info about prerendered pages:
```ts
interface Prerendered {
	pages: Map<string, { file: string }>;
	assets: Map<string, { type: string }>;
	redirects: Map<string, { status: number; location: string }>;
	paths: string[];
}
```

## Remote Functions

**RemoteCommand** - Server function returning single value:
```ts
type RemoteCommand<Input, Output> = {
	(arg: Input): Promise<Awaited<Output>> & {
		updates(...queries: Array<RemoteQuery<any> | RemoteQueryOverride>): Promise<Awaited<Output>>;
	};
	get pending(): number;
};
```

**RemoteQuery** - Server function returning reactive value:
```ts
type RemoteQuery<T> = RemoteResource<T> & {
	set(value: T): void;
	refresh(): Promise<void>;
	withOverride(update: (current: Awaited<T>) => Awaited<T>): RemoteQueryOverride;
};
```

**RemoteForm** - Server form function:
```ts
type RemoteForm<Input, Output> = {
	[attachment: symbol]: (node: HTMLFormElement) => void;
	method: 'POST';
	action: string;
	enhance(callback: (opts: { form: HTMLFormElement; data: Input; submit: () => Promise<void> & { updates(...): Promise<void> } }) => void | Promise<void>): {...};
	for(id: ExtractId<Input>): Omit<RemoteForm<Input, Output>, 'for'>;
	preflight(schema: StandardSchemaV1<Input, any>): RemoteForm<Input, Output>;
	validate(options?: { includeUntouched?: boolean; preflightOnly?: boolean }): Promise<void>;
	get result(): Output | undefined;
	get pending(): number;
	fields: RemoteFormFields<Input>;
	buttonProps: { type: 'submit'; formmethod: 'POST'; formaction: string; onclick: (event: Event) => void; enhance(...); get pending(): number };
};
```

**RemoteResource** - Base for query/command results:
```ts
type RemoteResource<T> = Promise<Awaited<T>> & {
	get error(): any;
	get loading(): boolean;
	get current(): Awaited<T> | undefined;
	ready: boolean;
};
```

**RemoteFormField** - Form field accessor:
```ts
type RemoteFormField<Value> = RemoteFormFieldMethods<Value> & {
	as<T extends RemoteFormFieldType<Value>>(...args: AsArgs<T, Value>): InputElementProps<T>;
};
```

**RemoteFormIssue** - Validation issue:
```ts
interface RemoteFormIssue {
	message: string;
	path: Array<string | number>;
}
```

## Errors

**HttpError** - From `error()`:
```ts
interface HttpError {
	status: number; // 400-599
	body: App.Error;
}
```

**Redirect** - From `redirect()`:
```ts
interface Redirect {
	status: 300 | 301 | 302 | 303 | 304 | 305 | 306 | 307 | 308;
	location: string;
}
```

**ValidationError** - From `invalid()`:
```ts
interface ValidationError {
	issues: StandardSchemaV1.Issue[];
}
```

## Utilities

**VERSION** - SvelteKit version string.

**ParamMatcher** - Custom route parameter validation:
```ts
type ParamMatcher = (param: string) => boolean;
```

**ResolveOptions** - Options for `resolve()` in handle hook:
```ts
interface ResolveOptions {
	transformPageChunk?(input: { html: string; done: boolean }): MaybePromise<string | undefined>;
	filterSerializedResponseHeaders?(name: string, value: string): boolean;
	preload?(input: { type: 'font' | 'css' | 'js' | 'asset'; path: string }): boolean;
}
```

**RouteDefinition** - Route metadata:
```ts
interface RouteDefinition<Config = any> {
	id: string;
	api: { methods: Array<HttpMethod | '*'> };
	page: { methods: Array<'GET' | 'POST'> };
	pattern: RegExp;
	prerender: PrerenderOption;
	segments: RouteSegment[];
	methods: Array<HttpMethod | '*'>;
	config: Config;
}
```

**SSRManifest** - Server-side manifest:
```ts
interface SSRManifest {
	appDir: string;
	appPath: string;
	assets: Set<string>;
	mimeTypes: Record<string, string>;
	_: { client: ...; nodes: SSRNodeLoader[]; remotes: Record<string, () => Promise<any>>; routes: SSRRoute[]; prerendered_routes: Set<string>; matchers: () => Promise<Record<string, ParamMatcher>>; server_assets: Record<string, number> };
}
```

**InvalidField** - Imperative validation error builder:
```ts
type InvalidField<T> = {
	[K in keyof T]-?: InvalidField<T[K]>;
} & ((message: string) => StandardSchemaV1.Issue);
```

Access properties for field-specific issues: `issue.fieldName('message')`. Call `invalid(issue.foo(...), issue.nested.bar(...))`.

## CSP

**CspDirectives** - Content Security Policy directives. Includes all standard CSP directives like 'script-src', 'style-src', 'img-src', etc. with typed sources.

**Csp** - CSP source types:
- ActionSource: 'strict-dynamic' | 'report-sample'
- BaseSource: 'self' | 'unsafe-eval' | 'unsafe-hashes' | 'unsafe-inline' | 'wasm-unsafe-eval' | 'none'
- CryptoSource: `nonce-${string}` | `sha256-${string}` | `sha384-${string}` | `sha512-${string}`
- HostSource: `${protocol}${hostname}${port}`
- SchemeSource: 'http:' | 'https:' | 'data:' | 'mediastream:' | 'blob:' | 'filesystem:'
- Source: Union of all above

## Misc Types

**MaybePromise<T>** - T | Promise<T>

**TrailingSlash** - 'never' | 'always' | 'ignore'

**PrerenderOption** - boolean | 'auto'

**HttpMethod** - 'GET' | 'HEAD' | 'POST' | 'PUT' | 'DELETE' | 'PATCH' | 'OPTIONS'

**Logger** - Logging interface with methods: (msg), success(msg), error(msg), warn(msg), minor(msg), info(msg)

**SubmitFunction** - Form submission handler for use:enhance directive.

**AwaitedActions** - Utility type for unpacking action return types.

**LoadProperties** - Utility type for load function return properties.

**NumericRange** - Utility type for numeric ranges.

**LessThan** - Utility type for numbers less than N.

### hooks-sequence
sequence() chains handle hooks with different ordering rules: transformPageChunk reversed, preload/filterSerializedResponseHeaders forward with first-wins semantics

## sequence

Helper function for chaining multiple `handle` hooks in middleware-like fashion.

### Behavior

- `transformPageChunk`: Applied in **reverse order** and merged
- `preload`: Applied in **forward order**, first one wins (subsequent calls skipped)
- `filterSerializedResponseHeaders`: Same as `preload` (first wins)

### Example

```js
import { sequence } from '@sveltejs/kit/hooks';

async function first({ event, resolve }) {
	console.log('first pre-processing');
	const result = await resolve(event, {
		transformPageChunk: ({ html }) => {
			console.log('first transform');
			return html;
		},
		preload: () => {
			console.log('first preload');
			return true;
		}
	});
	console.log('first post-processing');
	return result;
}

async function second({ event, resolve }) {
	console.log('second pre-processing');
	const result = await resolve(event, {
		transformPageChunk: ({ html }) => {
			console.log('second transform');
			return html;
		},
		preload: () => {
			console.log('second preload');
			return true;
		},
		filterSerializedResponseHeaders: () => {
			console.log('second filterSerializedResponseHeaders');
			return true;
		}
	});
	console.log('second post-processing');
	return result;
}

export const handle = sequence(first, second);
```

Execution order:
```
first pre-processing
first preload (wins, second preload skipped)
second pre-processing
second filterSerializedResponseHeaders (wins)
second transform
first transform (reverse order)
second post-processing
first post-processing
```

### Signature

```ts
function sequence(...handlers: Handle[]): Handle;
```

### node-polyfills
installPolyfills() makes web APIs (crypto, File) available as globals in Node.js

## installPolyfills

Installs polyfills for web APIs that are not available in Node.js environments.

```js
import { installPolyfills } from '@sveltejs/kit/node/polyfills';

installPolyfills();
```

Makes the following globals available:
- `crypto` - Web Crypto API
- `File` - File API for handling file objects

### node_adapter_api
Node.js HTTP adapter utilities: createReadableStream, getRequest, setResponse for converting between Node.js and Fetch API objects.

## createReadableStream

Converts a file on disk to a readable stream.

```js
import { createReadableStream } from '@sveltejs/kit/node';

const stream = createReadableStream('/path/to/file');
```

Available since 2.4.0.

## getRequest

Converts a Node.js `IncomingMessage` to a Fetch API `Request` object.

```js
import { getRequest } from '@sveltejs/kit/node';

const request = await getRequest({
  request: incomingMessage,
  base: '/app',
  bodySizeLimit: 1024 * 1024 // optional, in bytes
});
```

Parameters:
- `request`: Node.js `http.IncomingMessage`
- `base`: Base path for the application
- `bodySizeLimit`: Optional maximum request body size in bytes

## setResponse

Writes a Fetch API `Response` object to a Node.js `ServerResponse`.

```js
import { setResponse } from '@sveltejs/kit/node';

await setResponse(serverResponse, fetchResponse);
```

Parameters:
- `res`: Node.js `http.ServerResponse`
- `response`: Fetch API `Response` object

### vite_plugin
sveltekit() async function exports Vite plugins array from @sveltejs/kit/vite

## sveltekit

The `sveltekit()` function returns an array of Vite plugins required for SvelteKit.

```js
import { sveltekit } from '@sveltejs/kit/vite';

const plugins = await sveltekit();
```

**Signature:**
```ts
function sveltekit(): Promise<import('vite').Plugin[]>;
```

Returns a Promise that resolves to an array of Vite Plugin objects.

### $app_environment
Four environment constants: browser (client-side), building (build/prerender), dev (dev server), version (from config)

## Overview

The `$app/environment` module provides runtime environment information about the SvelteKit application.

## Exports

```js
import { browser, building, dev, version } from '$app/environment';
```

### browser
`boolean` — `true` if the app is running in the browser (client-side).

### building
`boolean` — `true` during the build step when SvelteKit analyzes the app by running it. Also applies during prerendering.

### dev
`boolean` — Whether the dev server is running. Not guaranteed to correspond to `NODE_ENV` or `MODE`.

### version
`string` — The value of `config.kit.version.name`.

### forms
Three form utilities: applyAction (updates form/status), deserialize (parses submission response), enhance (progressive form enhancement with custom handlers)

## applyAction

Updates the `form` property of the current page with given data and updates `page.status`. Redirects to the nearest error page on error.

```ts
function applyAction<Success, Failure>(
  result: ActionResult<Success, Failure>
): Promise<void>;
```

## deserialize

Deserializes the response from a form submission.

```js
import { deserialize } from '$app/forms';

async function handleSubmit(event) {
  const response = await fetch('/form?/action', {
    method: 'POST',
    body: new FormData(event.target)
  });
  const result = deserialize(await response.text());
}
```

```ts
function deserialize<Success, Failure>(
  result: string
): ActionResult<Success, Failure>;
```

## enhance

Enhances a `<form>` element to work without JavaScript fallback.

The `submit` function is called on submission with FormData and the action to trigger. Call `cancel` to prevent submission. Use the abort `controller` to cancel if another submission starts. If a function is returned, it's called with the server response.

Default behavior (if no custom function or if `update` is called):
- Updates `form` prop with returned data if action is on same page
- Updates `page.status`
- Resets form and invalidates all data on successful submission without redirect
- Redirects on redirect response
- Redirects to error page on unexpected error

Custom callback options:
- `reset: false` - don't reset form values after successful submission
- `invalidateAll: false` - don't call `invalidateAll` after submission

```ts
function enhance<Success, Failure>(
  form_element: HTMLFormElement,
  submit?: SubmitFunction<Success, Failure>
): {
  destroy(): void;
};
```

### $app_navigation
Navigation API with lifecycle hooks (afterNavigate, beforeNavigate, onNavigate), programmatic navigation (goto with options for scroll/focus/invalidation, pushState/replaceState for shallow routing), data preloading (preloadCode/preloadData), and cache invalidation (invalidate with URL/predicate, invalidateAll, refreshAll).

## Navigation Functions

### afterNavigate
Lifecycle function that runs a callback when component mounts and on every navigation. Must be called during component initialization and remains active while mounted.

```js
import { afterNavigate } from '$app/navigation';

afterNavigate((navigation) => {
  console.log('Navigated to:', navigation);
});
```

### beforeNavigate
Navigation interceptor that triggers before navigation (link clicks, `goto()`, browser back/forward). Call `cancel()` to prevent navigation. For 'leave' type navigations (user leaving app), `cancel()` triggers browser unload dialog. When navigating to non-SvelteKit routes, `navigation.to.route.id` is `null`. Property `navigation.willUnload` is `true` for document-unloading navigations. Must be called during component initialization.

```js
import { beforeNavigate } from '$app/navigation';

beforeNavigate((navigation) => {
  if (unsavedChanges) {
    navigation.cancel();
  }
});
```

### disableScrollHandling
Disables SvelteKit's built-in scroll handling when called during page updates (in `onMount`, `afterNavigate`, or actions). Generally discouraged as it breaks user expectations.

```js
import { disableScrollHandling } from '$app/navigation';

onMount(() => {
  disableScrollHandling();
  // Custom scroll logic here
});
```

### goto
Programmatically navigate to a route. Returns Promise that resolves when navigation completes or rejects on failure. For external URLs, use `window.location = url` instead.

Options:
- `replaceState`: Replace history entry instead of pushing
- `noScroll`: Prevent automatic scroll to top
- `keepFocus`: Keep current element focused
- `invalidateAll`: Re-run all load functions
- `invalidate`: Array of specific resources to invalidate
- `state`: Custom page state

```js
import { goto } from '$app/navigation';

await goto('/about', { 
  replaceState: true, 
  noScroll: true,
  invalidate: ['custom:data']
});
```

### invalidate
Re-run `load` functions that depend on a specific URL via `fetch` or `depends`. Accepts string/URL (must match exactly, including query params) or function predicate. Custom identifiers use format `[a-z]+:` (e.g., `custom:state`). Returns Promise resolving when page updates.

```js
import { invalidate } from '$app/navigation';

// Exact match
invalidate('/api/data');

// Pattern match
invalidate((url) => url.pathname === '/path');

// Custom identifier
invalidate('custom:state');
```

### invalidateAll
Re-run all `load` and `query` functions for currently active page. Returns Promise resolving when page updates.

```js
import { invalidateAll } from '$app/navigation';

await invalidateAll();
```

### onNavigate
Lifecycle function that runs callback immediately before navigation to new URL (except full-page navigations). If callback returns Promise, SvelteKit waits for resolution before completing navigation (useful for `document.startViewTransition`). If callback returns function, it's called after DOM updates. Must be called during component initialization.

```js
import { onNavigate } from '$app/navigation';

onNavigate(async (navigation) => {
  if (!document.startViewTransition) return;
  
  return new Promise((resolve) => {
    document.startViewTransition(resolve);
  });
});
```

### preloadCode
Programmatically import code for routes not yet fetched. Specify routes by pathname like `/about` or `/blog/*`. Unlike `preloadData`, doesn't call load functions. Returns Promise resolving when modules imported.

```js
import { preloadCode } from '$app/navigation';

await preloadCode('/about');
await preloadCode('/blog/*');
```

### preloadData
Programmatically preload page: ensures code is loaded and calls page's load function. Same behavior as `<a data-sveltekit-preload-data>`. If next navigation is to preloaded `href`, load values are used for instant navigation. Returns Promise with result object containing either `{type: 'loaded', status, data}` or `{type: 'redirect', location}`.

```js
import { preloadData } from '$app/navigation';

const result = await preloadData('/about');
if (result.type === 'loaded') {
  console.log(result.data);
}
```

### pushState
Programmatically create new history entry with given `page.state`. Pass `''` as first argument to use current URL. Used for shallow routing.

```js
import { pushState } from '$app/navigation';

pushState('', { count: 1 });
pushState('/new-url', { count: 2 });
```

### replaceState
Programmatically replace current history entry with given `page.state`. Pass `''` as first argument to use current URL. Used for shallow routing.

```js
import { replaceState } from '$app/navigation';

replaceState('', { count: 1 });
replaceState('/new-url', { count: 2 });
```

### refreshAll
Re-run all currently active remote functions and all `load` functions for active page (unless disabled via `includeLoadFunctions: false` option). Returns Promise resolving when page updates.

```js
import { refreshAll } from '$app/navigation';

await refreshAll();
await refreshAll({ includeLoadFunctions: false });
```

### $app_paths
Four path resolution utilities: asset() for static files, resolve() for pathnames/route IDs with base path and dynamic segments; assets, base, resolveRoute deprecated.

## asset

Resolve URLs of assets in the `static` directory by prefixing with `config.kit.paths.assets` or the base path.

During server rendering, the base path is relative to the current page.

```js
import { asset } from '$app/paths';

<img alt="a potato" src={asset('/potato.jpg')} />
```

Available since 2.26.

## assets (deprecated)

Use `asset()` instead.

An absolute path matching `config.kit.paths.assets`. During `vite dev` or `vite preview`, it's replaced with `'/_svelte_kit_assets'` since assets don't yet live at their eventual URL.

Type: `'' | 'https://${string}' | 'http://${string}' | '/_svelte_kit_assets'`

## base (deprecated)

Use `resolve()` instead.

A string matching `config.kit.paths.base`.

```js
<a href="{base}/your-page">Link</a>
```

Type: `'' | '/${string}'`

## resolve

Resolve a pathname by prefixing with the base path, or resolve a route ID by populating dynamic segments with parameters.

During server rendering, the base path is relative to the current page.

```js
import { resolve } from '$app/paths';

// pathname
const resolved = resolve(`/blog/hello-world`);

// route ID with parameters
const resolved = resolve('/blog/[slug]', { slug: 'hello-world' });
```

Available since 2.26.

## resolveRoute (deprecated)

Use `resolve()` instead.

Signature: `function resolveRoute<T extends RouteId | Pathname>(...args: ResolveArgs<T>): ResolvedPathname`

### $app_server
Server-side remote functions (command, query, form, prerender) with optional schema validation, plus getRequestEvent and read utilities for asset access.

## command

Creates a remote command that executes on the server when called from the browser via `fetch`.

```js
import { command } from '$app/server';

// No input
const cmd1 = command(() => serverSideValue);

// With validation
const cmd2 = command('unchecked', (input) => processInput(input));
const cmd3 = command(schema, (input) => processInput(input));
```

## form

Creates a form object spreadable onto `<form>` elements.

```js
import { form } from '$app/server';

const myForm = form(() => ({ success: true }));
const validatedForm = form(schema, (data, issue) => handleSubmit(data));
```

## getRequestEvent

Returns the current `RequestEvent` in server hooks, server `load` functions, actions, and endpoints. Must be called synchronously in environments without `AsyncLocalStorage`.

```js
import { getRequestEvent } from '$app/server';

const event = getRequestEvent();
```

## prerender

Creates a remote prerender function that executes on the server during build.

```js
import { prerender } from '$app/server';

const fn = prerender(() => data);
const validated = prerender(schema, (input) => data, {
  inputs: function* () { yield input1; yield input2; },
  dynamic: true
});
```

## query

Creates a remote query that executes on the server when called from the browser.

```js
import { query } from '$app/server';

const q1 = query(() => fetchData());
const q2 = query('unchecked', (input) => fetchData(input));
const q3 = query(schema, (input) => fetchData(input));
```

### query.batch

Collects multiple query calls and executes them in a single request (available since 2.35).

```js
const batchQuery = query.batch(schema, (args) => 
  (arg, idx) => processArg(arg)
);
```

## read

Reads the contents of an imported asset from the filesystem.

```js
import { read } from '$app/server';
import somefile from './somefile.txt';

const asset = read(somefile);
const text = await asset.text();
```

### $app_state
Three read-only state objects ($app/state): navigating (in-progress navigation), page (current page data/form/state/metadata, reactive with runes only), updated (app version check with polling).

## Overview

SvelteKit provides three read-only state objects via the `$app/state` module: `page`, `navigating`, and `updated`. Available since SvelteKit 2.12 (use `$app/stores` for earlier versions).

```js
import { navigating, page, updated } from '$app/state';
```

## navigating

Represents an in-progress navigation with properties: `from`, `to`, `type`, and `delta` (if `type === 'popstate'`). All values are `null` when no navigation is occurring or during server rendering.

```ts
const navigating:
	| import('@sveltejs/kit').Navigation
	| {
			from: null;
			to: null;
			type: null;
			willUnload: null;
			delta: null;
			complete: null;
	  };
```

## page

A read-only reactive object containing current page information:
- Combined `data` from all pages/layouts
- Current `form` prop value
- Page state set via `goto`, `pushState`, or `replaceState`
- Metadata: URL, route, parameters, error status

```svelte
<script>
	import { page } from '$app/state';
	const id = $derived(page.params.id); // Reactive with runes
</script>

<p>Currently at {page.url.pathname}</p>
{#if page.error}
	<span class="red">Problem detected</span>
{/if}
```

**Important:** Changes to `page` only work with runes (`$derived`). Legacy reactivity syntax (`$:`) will not reflect updates after initial load.

On the server, values can only be read during rendering (not in `load` functions). In the browser, values can be read at any time.

```ts
const page: import('@sveltejs/kit').Page;
```

## updated

A read-only reactive value initially `false`. When `version.pollInterval` is non-zero, SvelteKit polls for new app versions and sets `updated.current` to `true` when detected. Call `updated.check()` to force an immediate check.

```ts
const updated: {
	get current(): boolean;
	check(): Promise<boolean>;
};
```

### $app_stores
Deprecated store-based API for navigating, page, and updated; replaced by $app/state in SvelteKit 2.12+.

## Overview

Store-based equivalents of exports from `$app/state`. Deprecated in SvelteKit 2.12+ in favor of `$app/state` (requires Svelte 5).

```js
import { getStores, navigating, page, updated } from '$app/stores';
```

## getStores

Returns an object containing `page`, `navigating`, and `updated` stores.

```js
const { page, navigating, updated } = getStores();
```

## navigating

Readable store. Value is a `Navigation` object with `from`, `to`, `type`, and optionally `delta` (when `type === 'popstate'`) during navigation, reverts to `null` when finished.

Server: subscribe only during component initialization. Browser: subscribe anytime.

```ts
const navigating: Readable<Navigation | null>;
```

## page

Readable store containing page data.

Server: subscribe only during component initialization. Browser: subscribe anytime.

```ts
const page: Readable<Page>;
```

## updated

Readable store, initial value `false`. If `version.pollInterval` is non-zero, SvelteKit polls for new app versions and updates to `true` when detected. Has `check()` method to force immediate check.

Server: subscribe only during component initialization. Browser: subscribe anytime.

```ts
const updated: Readable<boolean> & { check(): Promise<boolean> };
```

### $app_types
Auto-generated type utilities for routes, pathnames, and parameters in SvelteKit apps; includes Asset, RouteId, Pathname, ResolvedPathname, RouteParams, and LayoutParams.

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

### $env_dynamic_private
$env/dynamic/private module provides server-side access to filtered runtime environment variables based on prefix configuration.

## Runtime Environment Variables

Access runtime environment variables defined by your platform via the `$env/dynamic/private` module.

### Usage

```ts
import { env } from '$env/dynamic/private';
console.log(env.DEPLOYMENT_SPECIFIC_VARIABLE);
```

### Variable Filtering

This module only includes variables that:
- Do NOT begin with `config.kit.env.publicPrefix`
- DO start with `config.kit.env.privatePrefix` (if configured)

### Client-Side Restriction

This module cannot be imported into client-side code.

### Development vs Production

In `dev`, `$env/dynamic` always includes environment variables from `.env`. In `prod`, this behavior depends on your adapter (e.g., `adapter-node` uses `process.env`).


### $env_dynamic_public
Dynamic public environment variables (PUBLIC_ prefix) accessible on client; larger network overhead than static variant.

## Dynamic Public Environment Variables

Access environment variables that begin with the public prefix (default: `PUBLIC_`) on the client side.

### Purpose
- Only includes variables prefixed with `config.kit.env.publicPrefix` (defaults to `PUBLIC_`)
- Can be safely exposed to client-side code
- Counterpart to `$env/dynamic/private` for public variables

### Usage
```ts
import { env } from '$env/dynamic/public';
console.log(env.PUBLIC_DEPLOYMENT_SPECIFIC_VARIABLE);
```

### Performance Consideration
Public dynamic environment variables are sent from server to client, increasing network request size. Use `$env/static/public` instead when possible for better performance.

### $env_static_private
Static build-time private environment variables from .env files, server-side only, enabling dead code elimination.

## Static Private Environment Variables

Module for accessing private environment variables that are statically injected at build time.

### Source
Variables are loaded by Vite from `.env` files and `process.env`. Only includes variables that:
- Do NOT begin with `config.kit.env.publicPrefix`
- DO start with `config.kit.env.privatePrefix` (if configured)

### Key Difference from Dynamic
Unlike `$env/dynamic/private`, values are statically injected into the bundle at build time, enabling optimizations like dead code elimination.

### Usage
```ts
import { API_KEY } from '$env/static/private';
```

### Important Notes
- Cannot be imported into client-side code
- All referenced environment variables should be declared in `.env` files, even if empty:
  ```
  MY_FEATURE_FLAG=""
  ```
- Override values from command line:
  ```sh
  MY_FEATURE_FLAG="enabled" npm run dev
  ```

### $env_static_public
Static public environment variables (PUBLIC_ prefix) replaced at build time, safe for client-side exposure

## $env/static/public

Public environment variables that are safely exposed to client-side code.

Only includes environment variables beginning with the configured public prefix (defaults to `PUBLIC_`). Values are replaced statically at build time.

### Usage

```ts
import { PUBLIC_BASE_URL } from '$env/static/public';
```

Unlike `$env/static/private`, these variables can be safely used in browser code since they are intended to be public.

### $lib_alias
$lib is an auto-configured import alias pointing to src/lib (customizable in config)

## $lib Import Alias

SvelteKit automatically makes files under `src/lib` available using the `$lib` import alias.

The alias can be customized to point to a different directory via the config file (see configuration#files).

### Example

```svelte
<!--- file: src/lib/Component.svelte --->
A reusable component
```

```svelte
<!--- file: src/routes/+page.svelte --->
<script>
    import Component from '$lib/Component.svelte';
</script>

<Component />
```

### $service-worker
Service worker module providing build metadata: base path, Vite-generated files, static files, prerendered routes, and version for cache invalidation.

## Overview

The `$service-worker` module is only available to service workers and provides access to build and deployment metadata.

## Exports

### base
```js
const base: string;
```
The base path of the deployment, calculated from `location.pathname`. Equivalent to `config.kit.paths.base` but continues working correctly if deployed to a subdirectory. Note: `assets` is not available since service workers cannot be used with `config.kit.paths.assets`.

### build
```js
const build: string[];
```
Array of URL strings for files generated by Vite, suitable for caching with `cache.addAll(build)`. Empty during development.

### files
```js
const files: string[];
```
Array of URL strings for files in the static directory (or `config.kit.files.assets`). Customizable via `config.kit.serviceWorker.files`.

### prerendered
```js
const prerendered: string[];
```
Array of pathnames for prerendered pages and endpoints. Empty during development.

### version
```js
const version: string;
```
From `config.kit.version`. Useful for generating unique cache names so later deployments can invalidate old caches.

## Usage Example
```js
import { base, build, files, prerendered, version } from '$service-worker';

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(`cache-${version}`).then((cache) => {
      cache.addAll([...build, ...files, ...prerendered]);
    })
  );
});
```

### configuration
SvelteKit configuration in svelte.config.js: adapter, alias, appDir, csp (mode/directives/reportOnly), csrf (checkOrigin/trustedOrigins), embedded, env (dir/publicPrefix/privatePrefix), experimental (tracing/instrumentation/remoteFunctions), inlineStyleThreshold, moduleExtensions, outDir, output (preloadStrategy/bundleStrategy), paths (assets/base/relative), prerender (concurrency/crawl/entries/error handlers/origin), router (type/resolution), typescript (config function), version (name/pollInterval).

## Overview
SvelteKit configuration lives in `svelte.config.js` at the project root. The config object extends `vite-plugin-svelte`'s options and is used by other Svelte tooling.

```js
import adapter from '@sveltejs/adapter-auto';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	kit: {
		adapter: adapter()
	}
};

export default config;
```

## Config Structure
- `kit?: KitConfig` - SvelteKit options
- `[key: string]: any` - Additional options for integrating tooling

## KitConfig Options

### adapter
Runs during `vite build`. Determines how output is converted for different platforms. Default: `undefined`

### alias
Object mapping import aliases to file paths. Automatically passed to Vite and TypeScript. Default: `{}`
```js
alias: {
	'my-file': 'path/to/my-file.js',
	'my-directory': 'path/to/my-directory',
	'my-directory/*': 'path/to/my-directory/*'
}
```
Note: `$lib` alias is controlled by `config.kit.files.lib`. Run `npm run dev` to auto-generate alias config in `jsconfig.json`/`tsconfig.json`.

### appDir
Directory where SvelteKit stores static assets and internally-used routes. Default: `"_app"`

If `paths.assets` is specified, creates two app directories: `${paths.assets}/${appDir}` and `${paths.base}/${appDir}`.

### csp
Content Security Policy configuration to protect against XSS attacks.

```js
csp: {
	directives: {
		'script-src': ['self']
	},
	reportOnly: {
		'script-src': ['self'],
		'report-uri': ['/']
	}
}
```

Options:
- `mode?: 'hash' | 'nonce' | 'auto'` - Default: `'auto'`. Use hashes for prerendered pages, nonces for dynamic pages
- `directives?: CspDirectives` - Added to `Content-Security-Policy` headers
- `reportOnly?: CspDirectives` - Added to `Content-Security-Policy-Report-Only` headers

SvelteKit augments directives with nonces/hashes for inline styles and scripts. Use `%sveltekit.nonce%` placeholder in `src/app.html` for manual script/link nonces.

For prerendered pages, CSP header is added via `<meta http-equiv>` tag (ignores `frame-ancestors`, `report-uri`, `sandbox`).

Note: Svelte transitions create inline `<style>` elements, so either leave `style-src` unspecified or add `unsafe-inline`.

### csrf
Cross-site request forgery protection.

```js
csrf: {
	checkOrigin: true,
	trustedOrigins: ['https://payment-gateway.com']
}
```

Options:
- `checkOrigin?: boolean` - Default: `true` (deprecated, use `trustedOrigins: ['*']`). Checks incoming `origin` header for POST/PUT/PATCH/DELETE form submissions
- `trustedOrigins?: string[]` - Default: `[]`. Array of origins allowed for cross-origin form submissions. Use `'*'` to trust all origins (not recommended). Only applies in production.

### embedded
Whether app is embedded inside a larger app. Default: `false`

If `true`, SvelteKit adds event listeners on parent of `%sveltekit.body%` instead of `window`, and passes `params` from server rather than inferring from `location.pathname`.

Note: Multiple embedded SvelteKit apps on same page with client-side features is not supported.

### env
Environment variable configuration.

```js
env: {
	dir: '.',
	publicPrefix: 'PUBLIC_',
	privatePrefix: ''
}
```

Options:
- `dir?: string` - Default: `"."`. Directory to search for `.env` files
- `publicPrefix?: string` - Default: `"PUBLIC_"`. Prefix for variables safe to expose to client (accessible via `$env/static/public` and `$env/dynamic/public`)
- `privatePrefix?: string` - Default: `""` (v1.21.0+). Prefix for unsafe variables (accessible via `$env/static/private` and `$env/dynamic/private`). Variables matching neither prefix are discarded.

### experimental
Experimental features (not subject to semantic versioning).

```js
experimental: {
	tracing: {
		server: false,
		serverFile: false
	},
	instrumentation: {
		server: false
	},
	remoteFunctions: false
}
```

Options:
- `tracing?: {server?: boolean, serverFile?: boolean}` - Default: `{server: false, serverFile: false}` (v2.31.0+). Enable OpenTelemetry tracing for `handle` hook, `load` functions, form actions, remote functions
- `instrumentation?: {server?: boolean}` - Default: `{server: false}` (v2.31.0+). Enable `instrumentation.server.js` for tracing/observability
- `remoteFunctions?: boolean` - Default: `false`. Enable experimental remote functions feature

### files (deprecated)
Where to find various files within project.

```js
files: {
	src: 'src',
	assets: 'static',
	hooks: {
		client: 'src/hooks.client',
		server: 'src/hooks.server',
		universal: 'src/hooks'
	},
	lib: 'src/lib',
	params: 'src/params',
	routes: 'src/routes',
	serviceWorker: 'src/service-worker',
	appTemplate: 'src/app.html',
	errorTemplate: 'src/error.html'
}
```

### inlineStyleThreshold
Inline CSS in `<style>` block at HTML head. Value is max length in UTF-16 code units. Default: `0`

Improves First Contentful Paint but generates larger HTML and reduces browser cache effectiveness.

### moduleExtensions
File extensions SvelteKit treats as modules. Default: `[".js", ".ts"]`

Files not matching `config.extensions` or `config.kit.moduleExtensions` are ignored by router.

### outDir
Directory where SvelteKit writes files during `dev` and `build`. Default: `".svelte-kit"`

Exclude from version control.

### output
Build output format options.

```js
output: {
	preloadStrategy: 'modulepreload',
	bundleStrategy: 'split'
}
```

Options:
- `preloadStrategy?: 'modulepreload' | 'preload-js' | 'preload-mjs'` - Default: `"modulepreload"` (v1.8.4+). Preload strategy for JavaScript modules:
  - `modulepreload` - Uses `<link rel="modulepreload">`. Best in Chromium, Firefox 115+, Safari 17+
  - `preload-js` - Uses `<link rel="preload">`. Prevents waterfalls in Chromium/Safari but causes double-parsing in Chromium and double requests in Firefox. Good for iOS
  - `preload-mjs` - Uses `<link rel="preload">` with `.mjs` extension. Prevents double-parsing in Chromium. Best overall performance if server serves `.mjs` with correct `Content-Type`

- `bundleStrategy?: 'split' | 'single' | 'inline'` - Default: `'split'` (v2.13.0+). How JS/CSS files are loaded:
  - `'split'` - Multiple files loaded lazily as user navigates (recommended)
  - `'single'` - One JS bundle and one CSS file for entire app
  - `'inline'` - Inline all JS/CSS into HTML (usable without server)

For `'split'`, adjust bundling via Vite's `build.rollupOptions.output.experimentalMinChunkSize` and `output.manualChunks`.

For inlining assets, set Vite's `build.assetsInlineLimit` and import assets through Vite:
```js
// vite.config.js
export default defineConfig({
	build: {
		assetsInlineLimit: Infinity
	}
});
```

```svelte
// src/routes/+layout.svelte
<script>
	import favicon from './favicon.png';
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>
```

### paths
URL path configuration.

```js
paths: {
	assets: '',
	base: '',
	relative: true
}
```

Options:
- `assets?: '' | 'http://...' | 'https://...'` - Default: `""`. Absolute path where app files are served from (useful for storage buckets)
- `base?: '' | '/${string}'` - Default: `""`. Root-relative path where app is served (e.g., `/base-path`). Must start but not end with `/`. Prepend to root-relative links using `base` from `$app/paths`: `<a href="{base}/page">Link</a>`
- `relative?: boolean` - Default: `true` (v1.9.0+). Use relative asset paths. If `true`, `base` and `assets` from `$app/paths` replaced with relative paths during SSR for portable HTML. If `false`, paths always root-relative unless `paths.assets` is external URL. Single-page app fallback pages always use absolute paths. Set to `false` if using `<base>` element to prevent incorrect asset URL resolution.

### prerender
Prerendering configuration.

```js
prerender: {
	concurrency: 1,
	crawl: true,
	entries: ['*'],
	handleHttpError: 'fail',
	handleMissingId: 'fail',
	handleEntryGeneratorMismatch: 'fail',
	handleUnseenRoutes: 'fail',
	origin: 'http://sveltekit-prerender'
}
```

Options:
- `concurrency?: number` - Default: `1`. Simultaneous pages to prerender. JS is single-threaded but useful when network-bound
- `crawl?: boolean` - Default: `true`. Find pages by following links from `entries`
- `entries?: Array<'*' | '/${string}'>` - Default: `["*"]`. Pages to prerender or start crawling from. `'*'` includes all routes with no required parameters (optional parameters empty)
- `handleHttpError?: 'fail' | 'ignore' | 'warn' | (details) => void` - Default: `'fail'` (v1.15.7+). Handle HTTP errors during prerendering. Custom handler receives `{status, path, referrer, referenceType, message}`
- `handleMissingId?: 'fail' | 'ignore' | 'warn' | (details) => void` - Default: `'fail'` (v1.15.7+). Handle hash links to missing `id` on destination. Custom handler receives `{path, id, referrers, message}`
- `handleEntryGeneratorMismatch?: 'fail' | 'ignore' | 'warn' | (details) => void` - Default: `'fail'` (v1.16.0+). Handle entry not matching generated route. Custom handler receives `{generatedFromId, entry, matchedId, message}`
- `handleUnseenRoutes?: 'fail' | 'ignore' | 'warn' | (details) => void` - Default: `'fail'` (v2.16.0+). Handle prerenderable routes not prerendered. Custom handler receives `{routes}`
- `origin?: string` - Default: `"http://sveltekit-prerender"`. Value of `url.origin` during prerendering

### router
Client-side router configuration.

```js
router: {
	type: 'pathname',
	resolution: 'client'
}
```

Options:
- `type?: 'pathname' | 'hash'` - Default: `"pathname"` (v2.14.0+). Router type:
  - `'pathname'` - URL pathname determines route (default, recommended)
  - `'hash'` - `location.hash` determines route. Disables SSR/prerendering. Only use if pathname unavailable (e.g., no server control). Requires links starting with `#/`

- `resolution?: 'client' | 'server'` - Default: `"client"` (v2.17.0+). Route determination:
  - `'client'` - Browser uses route manifest to determine components/load functions. Manifest loaded upfront
  - `'server'` - Server determines route for unvisited paths. Hides route list, enables middleware interception (A/B testing). Slightly slower for unvisited paths but mitigated by preloading. Prerendered routes have resolution prerendered too

### serviceWorker
Service worker configuration (details not provided in documentation).

### typescript
TypeScript configuration.

```js
typescript: {
	config: (config) => config
}
```

Options:
- `config?: (config: Record<string, any>) => Record<string, any> | void` - Default: `(config) => config` (v1.3.0+). Function to edit generated `tsconfig.json`. Mutate config (recommended) or return new one. Useful for extending shared `tsconfig.json` in monorepo. Paths should be relative to `.svelte-kit/tsconfig.json`

### version
Version management for client-side navigation.

```js
version: {
	name: 'commit-hash',
	pollInterval: 0
}
```

When SvelteKit detects new version deployed (using `name`), falls back to full-page navigation on load errors. If `pollInterval` non-zero, polls for new versions and sets `updated.current` to `true`.

Options:
- `name?: string` - Current app version string. Must be deterministic (e.g., commit ref, not `Math.random()`). Defaults to build timestamp. Example using git commit hash:
  ```js
  import * as child_process from 'node:child_process';
  
  export default {
  	kit: {
  		version: {
  			name: child_process.execSync('git rev-parse HEAD').toString().trim()
  		}
  	}
  };
  ```

- `pollInterval?: number` - Default: `0`. Milliseconds between version polls. `0` disables polling

Force full-page navigation on version change:
```svelte
<script>
	import { beforeNavigate } from '$app/navigation';
	import { updated } from '$app/state';

	beforeNavigate(({ willUnload, to }) => {
		if (updated.current && !willUnload && to?.url) {
			location.href = to.url.href;
		}
	});
</script>
```

### cli
SvelteKit CLI: Vite commands (dev/build/preview) plus svelte-kit sync for generating tsconfig.json and type definitions

## Vite CLI

SvelteKit uses Vite as its build tool. The primary CLI commands are run via npm scripts:

- `vite dev` — start development server
- `vite build` — build production version
- `vite preview` — run production build locally

## svelte-kit sync

`svelte-kit sync` generates `tsconfig.json` and all type definitions that can be imported as `./$types` in routing files. This command is automatically run as the `prepare` npm lifecycle script when creating a new project, so manual execution is typically unnecessary.

### types
Auto-generated route type definitions ($types.d.ts), $lib alias, and App namespace interfaces (Error, Locals, PageData, PageState, Platform) for ambient typing.

## Generated types

SvelteKit automatically generates `.d.ts` files for each endpoint and page, allowing you to type the `params` object without manual boilerplate.

Instead of manually typing `RequestHandler` and `Load` with params:
```js
/** @type {import('@sveltejs/kit').RequestHandler<{
    foo: string;
    bar: string;
    baz: string
  }>} */
export async function GET({ params }) {}
```

SvelteKit generates `$types.d.ts` files that can be imported as siblings:
```ts
// .svelte-kit/types/src/routes/[foo]/[bar]/[baz]/$types.d.ts
import type * as Kit from '@sveltejs/kit';

type RouteParams = {
	foo: string;
	bar: string;
	baz: string;
};

export type RequestHandler = Kit.RequestHandler<RouteParams>;
export type PageLoad = Kit.Load<RouteParams>;
```

Use in endpoints and pages:
```js
// src/routes/[foo]/[bar]/[baz]/+server.js
/** @type {import('./$types').RequestHandler} */
export async function GET({ params }) {}
```

```js
// src/routes/[foo]/[bar]/[baz]/+page.js
/** @type {import('./$types').PageLoad} */
export async function load({ params, fetch }) {}
```

Return types of load functions are available as `PageData` and `LayoutData` through `$types`, while the union of all `Actions` return values is available as `ActionData`.

Starting with version 2.16.0, helper types `PageProps` and `LayoutProps` are provided:
```svelte
<script>
	/** @type {import('./$types').PageProps} */
	let { data, form } = $props();
</script>
```

For versions before 2.16.0 or Svelte 4:
```svelte
<script>
	/** @type {{ data: import('./$types').PageData, form: import('./$types').ActionData }} */
	let { data, form } = $props();
</script>
```

Your `tsconfig.json` or `jsconfig.json` must extend from the generated `.svelte-kit/tsconfig.json`:
```json
{ "extends": "./.svelte-kit/tsconfig.json" }
```

## Default tsconfig.json

The generated `.svelte-kit/tsconfig.json` contains:

**Programmatically generated options** (can be overridden with caution):
```json
{
	"compilerOptions": {
		"paths": {
			"$lib": ["../src/lib"],
			"$lib/*": ["../src/lib/*"]
		},
		"rootDirs": ["..", "./types"]
	},
	"include": [
		"ambient.d.ts",
		"non-ambient.d.ts",
		"./types/**/$types.d.ts",
		"../vite.config.js",
		"../vite.config.ts",
		"../src/**/*.js",
		"../src/**/*.ts",
		"../src/**/*.svelte",
		"../tests/**/*.js",
		"../tests/**/*.ts",
		"../tests/**/*.svelte"
	],
	"exclude": [
		"../node_modules/**",
		"../src/service-worker.js",
		"../src/service-worker/**/*.js",
		"../src/service-worker.ts",
		"../src/service-worker/**/*.ts",
		"../src/service-worker.d.ts",
		"../src/service-worker/**/*.d.ts"
	]
}
```

**Required options** (should not be modified):
```json
{
	"compilerOptions": {
		"verbatimModuleSyntax": true,  // Ensures types imported with `import type`
		"isolatedModules": true,        // Vite compiles one module at a time
		"noEmit": true,                 // Type-checking only
		"lib": ["esnext", "DOM", "DOM.Iterable"],
		"moduleResolution": "bundler",
		"module": "esnext",
		"target": "esnext"
	}
}
```

Extend or modify using the `typescript.config` setting in `svelte.config.js`.

## $lib

Alias to `src/lib` (or configured `config.kit.files.lib`). Allows importing common components and utilities without relative path traversal.

### $lib/server

Subdirectory of `$lib`. SvelteKit prevents importing modules from `$lib/server` into client-side code (see server-only modules).

## app.d.ts

Home to ambient types available without explicit imports. Contains the `App` namespace with types influencing SvelteKit features.

### App.Error

Defines the shape of expected and unexpected errors. Expected errors are thrown using the `error` function; unexpected errors are handled by `handleError` hooks.

```dts
interface Error {
	message: string;
}
```

### App.Locals

Interface defining `event.locals`, accessible in server hooks (`handle`, `handleError`), server-only `load` functions, and `+server.js` files.

```dts
interface Locals {}
```

### App.PageData

Defines the shape of `page.data` state and `$page.data` store (data shared between all pages). The `Load` and `ServerLoad` functions in `./$types` are narrowed accordingly. Use optional properties for page-specific data; do not add index signatures.

```dts
interface PageData {}
```

### App.PageState

Shape of the `page.state` object, manipulated using `pushState` and `replaceState` from `$app/navigation`.

```dts
interface PageState {}
```

### App.Platform

For adapters providing platform-specific context via `event.platform`.

```dts
interface Platform {}
```

