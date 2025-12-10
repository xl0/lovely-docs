## Core Exports

```js
import { Server, VERSION, error, fail, invalid, isActionFailure, isHttpError, isRedirect, isValidationError, json, normalizeUrl, redirect, text } from '@sveltejs/kit';
```

## Response Helpers

- **error(status, body)** - Throws HTTP error (don't catch)
- **fail(status, data?)** - Creates ActionFailure for form failures
- **invalid(...issues)** - Throws validation error in form actions
- **json(data, init?)** - JSON Response
- **text(body, init?)** - Text Response
- **redirect(status, location)** - Redirects (don't catch)
- **normalizeUrl(url)** - Strips SvelteKit suffixes/trailing slashes

## Type Guards

- **isActionFailure(e)**, **isHttpError(e, status?)**, **isRedirect(e)**, **isValidationError(e)**

## Form Actions

```ts
type Action<Params, OutputData, RouteId> = (event: RequestEvent) => MaybePromise<OutputData>;
type Actions<Params, OutputData, RouteId> = Record<string, Action<...>>;
type ActionResult<Success, Failure> = 
	| { type: 'success'; status: number; data?: Success }
	| { type: 'failure'; status: number; data?: Failure }
	| { type: 'redirect'; status: number; location: string }
	| { type: 'error'; status?: number; error: any };
```

## Load Functions

```ts
type Load<Params, InputData, ParentData, OutputData, RouteId> = 
	(event: LoadEvent<...>) => MaybePromise<OutputData>;

interface LoadEvent<Params, Data, ParentData, RouteId> {
	fetch: typeof fetch; // Credentialed, relative URLs on server
	data: Data; // From +layout.server.js or +page.server.js
	setHeaders(headers: Record<string, string>): void;
	parent(): Promise<ParentData>;
	depends(...deps: string[]): void;
	untrack<T>(fn: () => T): T;
	tracing: { enabled: boolean; root: Span; current: Span }; // v2.31.0+
}
```

## RequestEvent

```ts
interface RequestEvent<Params, RouteId> {
	cookies: Cookies; // get/set/delete/serialize
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
	tracing: { enabled: boolean; root: Span; current: Span }; // v2.31.0+
}
```

## Cookies

```ts
interface Cookies {
	get(name: string, opts?: CookieParseOptions): string | undefined;
	getAll(opts?: CookieParseOptions): Array<{ name: string; value: string }>;
	set(name: string, value: string, opts: CookieSerializeOptions & { path: string }): void;
	delete(name: string, opts: CookieSerializeOptions & { path: string }): void;
	serialize(name: string, value: string, opts: CookieSerializeOptions & { path: string }): string;
}
```

httpOnly/secure default true (except localhost). sameSite defaults lax. Must specify path.

## Navigation

```ts
type NavigationType = 'enter' | 'form' | 'leave' | 'link' | 'goto' | 'popstate';

interface NavigationBase {
	from: NavigationTarget | null;
	to: NavigationTarget | null;
	willUnload: boolean;
	complete: Promise<void>;
}

interface NavigationTarget<Params, RouteId> {
	params: Params | null;
	route: { id: RouteId | null };
	url: URL;
}
```

## Page Store

```ts
interface Page<Params, RouteId> {
	url: URL & { pathname: ResolvedPathname };
	params: Params;
	route: { id: RouteId };
	status: number;
	error: App.Error | null;
	data: App.PageData & Record<string, any>;
	state: App.PageState; // pushState/replaceState
	form: any;
}
```

## Hooks

```ts
type Handle = (input: { event: RequestEvent; resolve(event, opts?): MaybePromise<Response> }) => MaybePromise<Response>;
type HandleFetch = (input: { event: RequestEvent; request: Request; fetch: typeof fetch }) => MaybePromise<Response>;
type HandleServerError = (input: { error: unknown; event: RequestEvent; status: number; message: string }) => MaybePromise<void | App.Error>;
type HandleClientError = (input: { error: unknown; event: NavigationEvent; status: number; message: string }) => MaybePromise<void | App.Error>;
type HandleValidationError<Issue> = (input: { issues: Issue[]; event: RequestEvent }) => MaybePromise<App.Error>;
type Reroute = (event: { url: URL; fetch: typeof fetch }) => MaybePromise<void | string>; // v2.3.0+
type Transport = Record<string, Transporter>;
type ClientInit = () => MaybePromise<void>; // v2.10.0+
type ServerInit = () => MaybePromise<void>; // v2.10.0+
```

## Adapters

```ts
interface Adapter {
	name: string;
	adapt(builder: Builder): MaybePromise<void>;
	supports?: { read?(...): boolean; instrumentation?(): boolean }; // v2.31.0+
	emulate?(): MaybePromise<Emulator>;
}

interface Builder {
	log: Logger;
	rimraf(dir: string): void;
	mkdirp(dir: string): void;
	config: ValidatedConfig;
	prerendered: Prerendered;
	routes: RouteDefinition[];
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

## Remote Functions

```ts
type RemoteCommand<Input, Output> = {
	(arg: Input): Promise<Awaited<Output>> & { updates(...queries): Promise<Awaited<Output>> };
	get pending(): number;
};

type RemoteQuery<T> = RemoteResource<T> & {
	set(value: T): void;
	refresh(): Promise<void>;
	withOverride(update: (current: Awaited<T>) => Awaited<T>): RemoteQueryOverride;
};

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

type RemoteResource<T> = Promise<Awaited<T>> & {
	get error(): any;
	get loading(): boolean;
	get current(): Awaited<T> | undefined;
	ready: boolean;
};
```

## Errors

```ts
interface HttpError { status: number; body: App.Error; }
interface Redirect { status: 300|301|302|303|304|305|306|307|308; location: string; }
interface ValidationError { issues: StandardSchemaV1.Issue[]; }
```

## Utilities

- **VERSION** - SvelteKit version
- **ParamMatcher** - Custom route parameter validation
- **ResolveOptions** - Options for resolve() in handle hook
- **RouteDefinition** - Route metadata
- **SSRManifest** - Server-side manifest
- **InvalidField** - Imperative validation error builder
- **CspDirectives** - Content Security Policy directives
- **MaybePromise<T>** - T | Promise<T>
- **TrailingSlash** - 'never' | 'always' | 'ignore'
- **PrerenderOption** - boolean | 'auto'
- **HttpMethod** - 'GET' | 'HEAD' | 'POST' | 'PUT' | 'DELETE' | 'PATCH' | 'OPTIONS'
- **Logger** - Logging interface