## Default rendering

SvelteKit uses hybrid rendering by default: server-side rendering (SSR) for the initial page load (improves SEO and perceived performance), then client-side rendering (CSR) for subsequent pages (faster navigation without re-rendering common components). This approach is called transitional apps.

## Static site generation

Use `adapter-static` to fully prerender your site as a static site generator (SSG). Alternatively, use the `prerender` page option to prerender only specific pages while dynamically server-rendering others with a different adapter. For very large statically generated sites, use `adapter-vercel` with Incremental Static Regeneration (ISR) to avoid long build times. SvelteKit allows mixing different rendering types on different pages.

## Single-page app

Build SPAs with SvelteKit using exclusive client-side rendering (CSR). Write your backend in SvelteKit or another language/framework. If using a separate backend, ignore `server` files in the docs.

## Multi-page app

SvelteKit isn't typically used for traditional MPAs, but you can:
- Remove all JavaScript on a page with `csr = false` to render subsequent links on the server
- Use `data-sveltekit-reload` to render specific links on the server

## Separate backend

Deploy your SvelteKit frontend separately from a backend written in Go, Java, PHP, Ruby, Rust, or C#. Recommended approach: use `adapter-node` or a serverless adapter. Alternative: deploy as an SPA served by your backend server (but has worse SEO and performance). Ignore `server` files in the docs. Reference the FAQ for making calls to a separate backend.

## Serverless app

Use `adapter-auto` for zero-config deployment to supported platforms, or use platform-specific adapters: `adapter-vercel`, `adapter-netlify`, `adapter-cloudflare`. Community adapters support almost any serverless environment. Some adapters offer an `edge` option for edge rendering to improve latency.

## Your own server

Deploy to your own server or VPS using `adapter-node`.

## Container

Run SvelteKit apps in containers (Docker, LXC) using `adapter-node`.

## Library

Create a library for other Svelte apps using the `@sveltejs/package` add-on by choosing the library option when running `sv create`.

## Offline app

SvelteKit has full service worker support for building offline apps and progressive web apps (PWAs).

## Mobile app

Turn a SvelteKit SPA into a mobile app with Tauri or Capacitor. Mobile features (camera, geolocation, push notifications) available via plugins. These platforms start a local web server and serve your app like a static host on your phone. Use `bundleStrategy: 'single'` to limit concurrent requests (e.g., Capacitor's HTTP/1 local server limits concurrent connections).

## Desktop app

Turn a SvelteKit SPA into a desktop app with Tauri, Wails, or Electron.

## Browser extension

Build browser extensions using `adapter-static` or community adapters tailored for browser extensions.

## Embedded device

Svelte's efficient rendering runs on low-power devices. Microcontrollers and TVs may limit concurrent connections. Use `bundleStrategy: 'single'` to reduce concurrent requests.