## Setup

Install `@sveltejs/adapter-netlify` and configure in `svelte.config.js` with `edge` and `split` options. Requires `netlify.toml` with build command and publish directory.

## Key Features

- **Edge Functions**: Set `edge: true` for Deno-based edge deployment
- **Netlify Forms**: Prerender HTML forms with `export const prerender = true`
- **Functions Context**: Access Netlify Identity via `event.platform.context`
- **File Access**: Use `read()` from `$app/server` instead of `fs`
- **Redirects**: Use `_redirects` file (higher priority than `netlify.toml`)