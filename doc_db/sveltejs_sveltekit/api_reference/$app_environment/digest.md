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