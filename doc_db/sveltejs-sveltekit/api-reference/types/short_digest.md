## Generated types

SvelteKit auto-generates `.d.ts` files with typed `RequestHandler` and `Load` functions. Import from `$types` instead of manually typing params:
```js
/** @type {import('./$types').RequestHandler} */
export async function GET({ params }) {}
```

Return types available as `PageData`, `LayoutData`, `ActionData`. Helper type `PageProps` combines data with form (v2.16.0+).

## $lib and app.d.ts

`$lib` aliases `src/lib`. `$lib/server` prevents client-side imports.

`app.d.ts` defines ambient types: `Error`, `Locals`, `PageData`, `PageState`, `Platform`.