## CSR
Client-side rendering (CSR) is the generation of page contents in the web browser using JavaScript. Enabled by default in SvelteKit, can be disabled with `csr = false` page option.

## Edge
Rendering on the edge refers to rendering an application in a content delivery network (CDN) near the user, improving latency by reducing request/response distance.

## Hybrid app
SvelteKit's default rendering mode: loads initial HTML from the server (SSR), then updates page contents on subsequent navigations via client-side rendering (CSR).

## Hydration
When fetching data during SSR, SvelteKit stores this data and transmits it to the client along with server-rendered HTML. Components initialize on the client with that data without calling API endpoints again. Svelte checks that the DOM is in the expected state and attaches event listeners in a process called hydration. Once fully hydrated, components react to property changes like any newly created Svelte component. Enabled by default, can be disabled with `csr = false` page option.

## ISR
Incremental static regeneration (ISR) allows generating static pages as visitors request them without redeploying, reducing build times compared to SSG sites with many pages. Available with `adapter-vercel`.

## MPA
Multi-page apps (MPA) are traditional applications that render each page view on the server, common in non-JavaScript languages.

## Prerendering
Computing page contents at build time and saving the HTML for display. Benefits: same as traditional server-rendered pages, avoids recomputing for each visitor, scales nearly for free. Tradeoff: expensive build process, content only updates by rebuilding and deploying.

Prerenderable content rule: any two users hitting it directly must get the same content from the server, and the page must not contain actions. Can prerender content loaded based on page parameters as long as all users see the same prerendered content.

Pre-rendered pages aren't limited to static content. Can build personalized pages if user-specific data is fetched and rendered client-side, but experiences downsides of not doing SSR for that content.

Control prerendering with `prerender` page option and `prerender` config in `svelte.config.js`.

## PWA
Progressive web app (PWA) is an app built using web APIs and technologies but functions like a mobile or desktop app. PWAs can be installed, allowing shortcuts on launcher, home screen, or start menu. Many utilize service workers for offline capabilities.

## Routing
By default, SvelteKit intercepts navigation (link clicks, browser forward/back) and handles it on the client by rendering the component for the new page, which makes calls to necessary API endpoints. This client-side routing updates the page without server requests.

Enabled by default, can be skipped with `data-sveltekit-reload` attribute.

## SPA
Single-page app (SPA) is an application where all requests load a single HTML file which then does client-side rendering based on the requested URL. All navigation is client-side routing with per-page contents updating and common layout elements remaining unchanged.

SPA serves an empty shell on initial request (differs from hybrid app which serves HTML). Large performance impact by forcing two network round trips before rendering begins. Recommended only in limited circumstances such as when wrapped in a mobile app.

Build SPAs with `adapter-static`.

## SSG
Static Site Generation (SSG) is a site where every page is prerendered. Benefits: no need to maintain or pay for servers to perform SSR, can be served from CDNs for great "time to first byte" performance. This delivery model is often called JAMstack.

Implement with `adapter-static` or by configuring every page to be prerendered using `prerender` page option or `prerender` config in `svelte.config.js`.

## SSR
Server-side rendering (SSR) is the generation of page contents on the server. Highly preferred for performance and SEO: significantly improves performance by avoiding extra round trips necessary in SPA, makes app accessible if JavaScript fails or is disabled. While some search engines can index client-side dynamically generated content, it takes longer.

Enabled by default in SvelteKit, can be disabled with `ssr` page option.