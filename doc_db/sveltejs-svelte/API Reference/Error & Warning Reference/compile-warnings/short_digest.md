## Accessibility (a11y_*)
Enforce accessible patterns: no `accesskey`, `autofocus`, or distracting elements; interactive elements need keyboard handlers and `tabindex`; labels need associated controls; media needs captions; ARIA attributes must match element roles and have correct types; no redundant roles.

## Attributes
Avoid `is` attribute; no `:` in attribute names; quoted component attributes will stringify; invalid HTML attributes.

## Code Quality
Empty blocks; lowercase component names; unused CSS (use `:global` to preserve); non-reactive state updates; deprecated syntax (`context="module"`, `<slot>`, `<svelte:component>`, `<svelte:self>`); HTML structure violations break hydration; reassigned state loses reactivity unless wrapped in function; removed/renamed compile options.