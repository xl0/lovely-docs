## Vitest Unit & Component Tests

Configure `vite.config.js` with `resolve: { conditions: ['browser'] }` when `VITEST` env var is set. Name test files `.svelte.test.js` to use runes. Use `$effect.root()` and `flushSync()` for effect testing.

Mount components with `mount(Component, { target, props })`. Use `@testing-library/svelte` for less brittle tests.

## Storybook

Create stories with `defineMeta()` and test interactions via the `play` function.

## Playwright E2E

Configure `playwright.config.js` with `webServer` to start your app. Write tests using page locators and assertions.