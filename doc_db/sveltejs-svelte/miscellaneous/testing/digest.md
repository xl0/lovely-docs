## Unit and Component Tests with Vitest

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

Use runes in test files by naming them `.svelte.test.js`. For tests using effects, wrap in `$effect.root()` and use `flushSync()` to execute pending effects synchronously.

### Component Testing

Install jsdom and configure `vite.config.js` with `test: { environment: 'jsdom' }`.

Use Svelte's `mount` API to test components:

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

Alternatively, use `@testing-library/svelte` for higher-level testing that's less brittle to component structure changes.

For tests involving two-way bindings, context, or snippet props, create a wrapper component.

## Component Tests with Storybook

Install Storybook via `npx sv add storybook`. Create stories and use the `play` function to simulate user interactions and make assertions:

```svelte
import { defineMeta } from '@storybook/addon-svelte-csf';
import { expect, fn } from 'storybook/test';

const { Story } = defineMeta({
	component: LoginForm,
	args: { onSubmit: fn() }
});

<Story name="Filled Form" play={async ({ args, canvas, userEvent }) => {
	await userEvent.type(canvas.getByTestId('email'), 'email@provider.com');
	await userEvent.click(canvas.getByRole('button'));
	await expect(args.onSubmit).toHaveBeenCalledTimes(1);
}} />
```

## End-to-End Tests with Playwright

Setup Playwright via Svelte CLI or `npm init playwright`. Configure `playwright.config.js` to start your application:

```js
const config = {
	webServer: {
		command: 'npm run build && npm run preview',
		port: 4173
	},
	testDir: 'tests',
	testMatch: /(.+\.)?(test|spec)\.[jt]s/
};
```

Write tests that interact with the DOM:

```js
import { expect, test } from '@playwright/test';

test('home page has expected h1', async ({ page }) => {
	await page.goto('/');
	await expect(page.locator('h1')).toBeVisible();
});
```