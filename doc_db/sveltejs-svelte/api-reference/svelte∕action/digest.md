## Action

Actions are functions called when an element is created. Type them using the `Action` interface:

```ts
export const myAction: Action<HTMLDivElement, { someProperty: boolean } | undefined> = (node, param = { someProperty: true }) => {
	// ...
}
```

`Action<HTMLDivElement>` and `Action<HTMLDivElement, undefined>` both indicate no parameters are accepted.

Actions can return an object with `update` and `destroy` methods, and optionally specify additional attributes and events via the `ActionReturn` interface.

## ActionReturn

Both properties are optional:
- `update`: Called whenever the action's parameter changes, after Svelte applies markup updates
- `destroy`: Called after the element is unmounted

You can specify additional attributes and events the action enables:

```ts
interface Attributes {
	newprop?: string;
	'on:event': (e: CustomEvent<boolean>) => void;
}

export function myAction(node: HTMLElement, parameter: Parameter): ActionReturn<Parameter, Attributes> {
	return {
		update: (updatedParameter) => {...},
		destroy: () => {...}
	};
}
```