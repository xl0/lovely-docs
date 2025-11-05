## Rest Parameters
Use `[...file]` syntax to match variable number of segments. Example: `/[org]/[repo]/tree/[branch]/[...file]` matches `/sveltejs/kit/tree/main/documentation/docs/04-advanced-routing.md` with `file: 'documentation/docs/04-advanced-routing.md'`. Rest parameters match zero or more segments, so `[...rest]` matches both `/a/z` and `/a/b/c/z`.

## 404 Pages
Create a catch-all route with rest parameters to render custom 404s. Create `src/routes/marx-brothers/[...path]/+page.js` that calls `error(404, 'Not Found')` to handle unmatched paths within a directory.

## Optional Parameters
Wrap parameters in double brackets to make them optional: `[[lang]]/home` matches both `/home` and `/en/home`. Optional parameters cannot follow rest parameters.

## Matching
Add matchers in `src/params/` directory to validate route parameters. Example matcher `src/params/fruit.js`:
```js
export function match(param) {
	return param === 'apple' || param === 'orange';
}
```
Use in routes as `src/routes/fruits/[page=fruit]`. Matchers run on both server and browser.

## Route Sorting
When multiple routes match a path, SvelteKit prioritizes by: specificity (no parameters > dynamic parameters), matchers (`[name=type]` > `[name]`), and alphabetically for ties. Optional and rest parameters have lowest priority unless they're the final segment.

## Encoding
Use hexadecimal escape sequences `[x+nn]` for special characters: `/` is `[x+2f]`, `:` is `[x+3a]`, etc. Example: `/smileys/:-)` becomes `src/routes/smileys/[x+3a]-[x+29]/+page.svelte`. Unicode sequences `[u+nnnn]` also work: `[u+d83e][u+dd2a]` equals `🤪`.

## Layout Groups
Use `(group)` directories to organize routes without affecting URLs. Routes in `(app)` and `(marketing)` groups can have separate layouts. Break out of layout hierarchy with `+page@segment` or `+layout@segment` syntax to inherit from a specific ancestor layout instead of the normal hierarchy.