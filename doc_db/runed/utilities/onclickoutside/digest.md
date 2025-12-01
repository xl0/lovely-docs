## Purpose
`onClickOutside` detects clicks outside a specified element's boundaries and executes a callback. Common use cases include dismissible dropdowns, modals, and other interactive components.

## Basic Usage
```svelte
import { onClickOutside } from "runed";

let container = $state<HTMLElement>()!;

onClickOutside(
	() => container,
	() => console.log("clicked outside")
);
```

## Controlled Listener
The function returns control methods: `start()` and `stop()` to programmatically manage the listener, plus a reactive read-only `enabled` property to check current status.

```svelte
const clickOutside = onClickOutside(
	() => dialog,
	() => {
		dialog.close();
		clickOutside.stop();
	},
	{ immediate: false }
);

function openDialog() {
	dialog.showModal();
	clickOutside.start();
}

function closeDialog() {
	dialog.close();
	clickOutside.stop();
}
```

## Options
- `immediate` (boolean, default: true): Whether the handler is enabled by default. If false, call `start()` to activate.
- `detectIframe` (boolean, default: false): Whether focus events from iframes trigger the callback. Enable if you need to detect interactions with iframe content.
- `document` (Document, default: global document): The document object to use.
- `window` (Window, default: global window): The window object to use.

## Type Signature
```ts
function onClickOutside<T extends Element = HTMLElement>(
	container: MaybeElementGetter<T>,
	callback: (event: PointerEvent | FocusEvent) => void,
	opts?: OnClickOutsideOptions
): {
	stop: () => boolean;
	start: () => boolean;
	readonly enabled: boolean;
}
```

The container parameter accepts either an element or a getter function returning an element. The callback receives either a PointerEvent or FocusEvent.