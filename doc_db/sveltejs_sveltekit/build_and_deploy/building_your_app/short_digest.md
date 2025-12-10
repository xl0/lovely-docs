## Build Stages

`vite build` runs two stages: Vite optimizes code/service worker and executes prerendering, then an adapter tunes for the target environment.

## Build-Time Code Execution

Check `building` from `$app/environment` to prevent code execution during build:

```js
import { building } from '$app/environment';
if (!building) setupMyDatabase();
```

## Preview

Use `vite preview` to test the production build locally in Node (not a perfect reproduction of deployed app).