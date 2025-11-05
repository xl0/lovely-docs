## Rest Parameters
`[...file]` matches variable segments: `/[org]/[repo]/tree/[branch]/[...file]` → `file: 'documentation/docs/04-advanced-routing.md'`

## Optional Parameters
`[[lang]]/home` matches both `/home` and `/en/home`

## Matching
Validate parameters with matchers in `src/params/fruit.js`:
```js
export function match(param) {
	return param === 'apple' || param === 'orange';
}
```
Use as `[page=fruit]` in routes.

## Route Sorting
Priority: specificity > matchers > alphabetical. Rest/optional params have lowest priority unless final.

## Encoding
Special characters: `/` → `[x+2f]`, `:` → `[x+3a]`. Unicode: `🤪` → `[u+d83e][u+dd2a]`

## Layout Groups
`(group)` directories organize routes without affecting URLs. Use `+page@segment` to break out of layout hierarchy.