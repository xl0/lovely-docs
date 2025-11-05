## mount
```js
const app = mount(App, { target: element, props: {...} });
```
Instantiates and mounts a component. Effects don't run; use `flushSync()` if needed.

## unmount
```js
unmount(app, { outro: true });
```
Removes a component, optionally playing transitions.

## render
```js
const { body, head } = render(App, { props: {...} });
```
Server-only. Returns HTML for SSR.

## hydrate
```js
const app = hydrate(App, { target: element, props: {...} });
```
Reuses SSR HTML and makes it interactive.