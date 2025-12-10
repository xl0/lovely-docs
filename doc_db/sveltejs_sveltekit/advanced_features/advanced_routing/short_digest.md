## Rest Parameters
`[...file]` matches variable segments; validate with matchers. Create catch-all routes for custom 404s.

## Optional Parameters
`[[lang]]/home` matches both `home` and `en/home`. Cannot follow rest parameters.

## Matching
Restrict parameters with matchers in `src/params/fruit.js`: `export function match(param) { return param === 'apple' || param === 'orange'; }`. Use: `[page=fruit]`.

## Route Sorting
Priority: specificity > matchers > optional/rest > alphabetical. `/foo-abc` matches `foo-abc/+page.svelte` before `foo-[c]/+page.svelte`.

## Encoding
Filesystem/URL-reserved chars use hex `[x+nn]`: `/` → `[x+2f]`, `:` → `[x+3a]`, etc. Unicode: `[u+nnnn]`. Example: `/smileys/:-)` → `smileys/[x+3a]-[x+29]/+page.svelte`.

## Advanced Layouts
**Groups**: `(app)` and `(marketing)` directories don't affect URLs, enable separate layouts.

**Breaking out**: `+page@(app).svelte` or `+layout@.svelte` resets hierarchy to ancestor. Use composition for complex cases.