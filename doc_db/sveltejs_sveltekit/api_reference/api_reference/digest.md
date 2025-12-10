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