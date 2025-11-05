## Unit and Integration Testing with Vitest

Install Vitest and configure `vite.config.js` to use browser entry points:

```js
import { defineConfig } from 'vitest/config';

export default defineConfig({
	resolve: process.env.VITEST
		? { conditions: ['browser'] }
		: undefined
});
```

Write unit tests for `.js/.ts` files:

```js
import { expect, test } from 'vitest';
import { multiplier } from './multiplier.svelte.js';

test('Multiplier', () => {
	let double = multiplier(0, 2);
	expect(double.value).toEqual(0);
	double.set(5);
	expect(double.value).toEqual(10);
});
```

### Using Runes in Tests

Test files with `.svelte` in the filename can use runes. For effects, wrap tests in `$effect.root()` and use `flushSync()` to execute pending effects synchronously:

```js
test('Effect', () => {
	const cleanup = $effect.root(() => {
		let count = $state(0);
		let log = logger(() => count);
		flushSync();
		expect(log).toEqual([0]);
		count = 1;
		flushSync();
		expect(log).toEqual([0, 1]);
	});
	cleanup();
});
```

### Component Testing

Install jsdom and configure `vite.config.js` with `environment: 'jsdom'`. Use Svelte's `mount` API:

```js
import { mount, unmount, flushSync } from 'svelte';
import Component from './Component.svelte';

test('Component', () => {
	const component = mount(Component, {
		target: document.body,
		props: { initial: 0 }
	});
	expect(document.body.innerHTML).toBe('<button>0</button>');
	document.body.querySelector('button').click();
	flushSync();
	expect(document.body.innerHTML).toBe('<button>1</button>');
	unmount(component);
});
```

For higher-level testing, use `@testing-library/svelte`:

```js
import { render, screen } from '@testing-library/svelte';
import userEvent from '@testing-library/user-event';

test('Component', async () => {
	const user = userEvent.setup();
	render(Component);
	const button = screen.getByRole('button');
	expect(button).toHaveTextContent(0);
	await user.click(button);
	expect(button).toHaveTextContent(1);
});
```

For tests with two-way bindings, context, or snippet props, create a wrapper component.

## E2E Testing with Playwright

Configure `playwright.config.js` to start your application:

```js
const config = {
	webServer: {
		command: 'npm run build && npm run preview',
		port: 4173
	},
	testDir: 'tests',
	testMatch: /(.+\.)?(test|spec)\.[jt]s/
};
export default config;
```

Write tests that interact with the DOM:

```js
import { expect, test } from '@playwright/test';

test('home page has expected h1', async ({ page }) => {
	await page.goto('/');
	await expect(page.locator('h1')).toBeVisible();
});
```