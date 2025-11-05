## Action

Type actions with `Action<Element, Parameter, Attributes>`:

```ts
export const myAction: Action<HTMLDivElement, { someProperty: boolean } | undefined> = (node, param = { someProperty: true }) => {}
```

## ActionReturn

Return an object with optional `update` and `destroy` methods:

```ts
export function myAction(node: HTMLElement, parameter: Parameter): ActionReturn<Parameter, Attributes> {
	return {
		update: (updatedParameter) => {...},
		destroy: () => {...}
	};
}
```