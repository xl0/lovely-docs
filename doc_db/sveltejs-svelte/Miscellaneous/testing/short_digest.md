## Unit/Integration Testing with Vitest

Configure `vite.config.js` to use browser entry points. Test files with `.svelte` in the name can use runes. Wrap effect tests in `$effect.root()` and use `flushSync()` for synchronous execution.

```js
test('Multiplier', () => {
	let double = multiplier(0, 2);
	expect(double.value).toEqual(0);
});
```

## Component Testing

Use `mount()` API or `@testing-library/svelte` for higher-level testing:

```js
const component = mount(Component, { target: document.body, props: { initial: 0 } });
```

## E2E Testing with Playwright

Configure `playwright.config.js` with webServer settings and write tests that interact with the DOM:

```js
test('home page has expected h1', async ({ page }) => {
	await page.goto('/');
	await expect(page.locator('h1')).toBeVisible();
});
```