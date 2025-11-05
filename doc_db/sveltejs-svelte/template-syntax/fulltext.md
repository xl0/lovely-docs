

## Pages

### basic-markup
Svelte template syntax for markup: tags, attributes with expressions, component props, event handling, and text interpolation.

## Tags
Lowercase tags are HTML elements, capitalized/dot-notation tags are components.

## Attributes & Props
Attributes support JavaScript expressions and shorthand: `{name}` replaces `name={name}`. Boolean attributes include if truthy, exclude if falsy. Other attributes include unless nullish.

## Spread attributes
```svelte
<Widget a="b" {...things} c="d" />
```
Order matters — later values override earlier.

## Events
Event attributes use `on` prefix and are case-sensitive. Svelte delegates certain events (click, input, keydown, etc.) to the root for performance. Use `{ bubbles: true }` when manually dispatching delegated events.

## Text expressions
```svelte
<h1>Hello {name}!</h1>
{@html htmlString}
```
Null/undefined omitted, others coerced to strings. Use `{@html}` for HTML (prevent XSS).

### if-blocks
Svelte if-blocks conditionally render content based on boolean expressions.

Conditionally render content with `{#if expression}...{/if}`. Chain conditions with `{:else if expression}` and `{:else}`.

### each-block
Svelte's each block for iterating over arrays and iterables with support for keying, destructuring, and else clauses.

Iterate with `{#each expression as name, index (key)}`. Use keys for intelligent list updates. Supports destructuring, rendering n times with `{#each { length: n }}`, and `{:else}` for empty lists.

```svelte
{#each items as { id, name }, i (id)}
	<li>{i + 1}: {name}</li>
{/each}

{#each todos as todo}
	<p>{todo.text}</p>
{:else}
	<p>No tasks!</p>
{/each}
```

### key
The {#key} block destroys and recreates its contents when an expression value changes, useful for component reinitialisation and triggering transitions.

{#key expression} destroys and recreates contents when the expression changes, causing component reinitialisation and triggering transitions:

```svelte
{#key value}
	<Component />
{/key}
```

### await
Await blocks handle Promise states with optional pending, then, and catch branches.

The `{#await}` block branches on Promise states (pending, fulfilled, rejected). Omit `catch`, the pending block, or `then` as needed. During SSR, only pending renders; non-Promise expressions skip to `then`.

```svelte
{#await promise}
  <p>loading...</p>
{:then value}
  <p>{value}</p>
{:catch error}
  <p>{error.message}</p>
{/await}
```

### snippets
Snippets are reusable, parameterized markup blocks that can be passed as component props and typed with the Snippet generic.

Snippets are reusable markup blocks declared with `{#snippet name(params)}...{/snippet}`. They can be passed as props to components, with implicit `children` snippet for component content. Type with `Snippet<[ParamTypes]>` from `'svelte'`. Snippets replace deprecated Svelte 4 slots.

### @render
The {@render} tag renders snippets, supporting expressions and optional chaining for undefined snippets.

Use `{@render ...}` to render snippets. Supports arbitrary expressions and optional chaining for undefined snippets:

```svelte
{@render sum(1, 2)}
{@render (cool ? coolSnippet : lameSnippet)()}
{@render children?.()}
```

### @html-tag
Inject raw HTML with {@html ...} tag, sanitize input to prevent XSS, and use :global modifier for styling injected content.

The `{@html ...}` tag injects raw HTML. Requires valid standalone HTML and sanitized input to prevent XSS. Injected content won't receive scoped styles—use `:global` modifier instead:

```svelte
<article>
	{@html content}
</article>

<style>
	article :global {
		a { color: hotpink }
	}
</style>
```

### @attach-directive
Attachments are reactive functions that run when elements mount or state updates, with optional cleanup and control over re-execution.

The `{@attach}` directive runs functions when elements mount or reactive state updates, with optional cleanup. Supports factories, inline definitions, component spreading, and can be controlled to avoid unnecessary re-runs using nested effects.

```svelte
function tooltip(content) {
  return (element) => {
    const tooltip = tippy(element, { content });
    return tooltip.destroy;
  };
}

<button {@attach tooltip(content)}>Hover me</button>
```

### @const
Define local constants within template blocks using {@const ...}

The `{@const ...}` tag defines a local constant within block scope.

```svelte
{#each boxes as box}
	{@const area = box.width * box.height}
	{area}
{/each}
```

Only allowed as immediate child of blocks, components, or `<svelte:boundary>`.

### @debug
Svelte's {@debug} tag for logging and debugging variable changes in templates.

`{@debug ...}` logs variable values on change and pauses execution with devtools open. Accepts comma-separated variable names only (not expressions). `{@debug}` without arguments triggers on any state change.

### bind
The `bind:` directive creates two-way data bindings between parent and child components or between JavaScript state and DOM elements.

## Two-way binding with `bind:`

Enables data flow from child to parent. Syntax: `bind:property={expression}` or `bind:property` if names match.

**Input bindings:** `bind:value` (coerces to number), `bind:checked`, `bind:indeterminate`, `bind:group` (radio/checkbox groups), `bind:files`

**Select:** `bind:value` on `<select>` or `<select multiple>`

**Media:** `<audio>`/`<video>` two-way: `currentTime`, `playbackRate`, `paused`, `volume`, `muted`; readonly: `duration`, `buffered`, `seekable`, `seeking`, `ended`, `readyState`, `played`

**Other:** `<img>` (readonly `naturalWidth`, `naturalHeight`), `<details bind:open>`, contenteditable (`innerHTML`, `innerText`, `textContent`), dimensions (readonly: `clientWidth`, `clientHeight`, `offsetWidth`, `offsetHeight`, `contentRect`, `contentBoxSize`, `borderBoxSize`, `devicePixelContentBoxSize`)

**Function bindings:** `bind:value={get, set}` for validation/transformation; use `{null, setter}` for readonly

**bind:this:** Reference DOM nodes or component instances

**Component props:** Mark with `$bindable()` rune to allow binding

### use-directive
The use: directive attaches action functions to elements for lifecycle management and custom behavior.

Actions are functions called on element mount via `use:` directive. Use `$effect` for setup/teardown. They accept optional arguments and can dispatch custom events. Type with `Action<NodeType, ParamType, EventHandlers>`.

### transition
Transitions animate elements entering/leaving the DOM with built-in or custom functions, supporting parameters, local/global scope, and lifecycle events.

## Transitions

Triggered when elements enter/leave DOM. Bidirectional and reversible.

```svelte
<div transition:fade={{ duration: 2000 }}>fades in and out</div>
```

**Local vs Global**: Local by default (only when block changes). Use `|global` for parent changes.

**Custom Functions**: Return object with `delay`, `duration`, `easing`, `css`, `tick`. Use `css` for performance:

```js
function whoosh(node, params) {
  return {
    duration: 400,
    css: (t, u) => `transform: scale(${t})`
  };
}
```

**Events**: `introstart`, `introend`, `outrostart`, `outroend`

### in-and-out-directives
Non-bidirectional transition directives that play independently rather than reversing each other.

`in:` and `out:` directives apply non-bidirectional transitions. Unlike `transition:`, they play independently—an `in` transition continues while an `out` transition plays, rather than reversing.

```svelte
{#if visible}
  <div in:fly={{ y: 200 }} out:fade>flies in, fades out</div>
{/if}
```

### animate
Animations triggered on reordering of keyed each blocks using built-in or custom animation functions.

## animate: Directive

Triggers animations when keyed each block contents are reordered. Use built-in functions or custom ones:

```svelte
{#each list as item (item)}
	<li animate:flip={{ delay: 500 }}>{item}</li>
{/each}
```

Custom animation functions receive `(node, { from: DOMRect, to: DOMRect }, params)` and return `{ delay?, duration?, easing?, css?, tick? }`. The `css(t, u)` method runs as a web animation; `tick(t, u)` runs on main thread.

### style-directive
Shorthand directive for setting inline styles on elements with support for expressions and important modifier.

The `style:` directive sets inline styles with shorthand syntax. Supports expressions, multiple styles, and `|important` modifier. Takes precedence over `style` attributes and `!important`.

```svelte
<div style:color="red" style:width={w} style:background-color|important={bg}>...</div>
```

### class
How to set classes on elements using the class attribute (with objects/arrays) or class: directive.

## Setting Classes

**Attribute approach (preferred):**
- Primitives: `class={condition ? 'large' : 'small'}`
- Objects: `class={{ cool, lame: !cool }}`
- Arrays: `class={[faded && 'saturate-0', large && 'scale-200']}`
- Nested arrays/objects flatten automatically
- Type-safe with `ClassValue` type

**Directive approach (legacy):**
```svelte
<div class:cool={cool} class:lame={!cool}>...</div>
<div class:cool>...</div>
```

### await-expressions
Svelte 5.36+ experimental feature enabling await expressions in scripts, derived declarations, and markup with synchronized updates, concurrent execution, and loading state management.

## Await in Svelte 5.36+
Enable with `experimental.async: true` in config. Use `await` in `<script>`, `$derived()`, and markup.

**Synchronized updates**: UI waits for async work to complete, preventing inconsistent states.

**Concurrency**: Multiple independent `await` in markup run in parallel; sequential ones in `<script>` behave like normal JS.

**Loading states**: Use `<svelte:boundary pending>` for placeholders, `$effect.pending()` for subsequent updates, `settled()` to wait for completion.

**SSR**: Await `render(App)` for async server-side rendering.

**Forking**: `fork()` API preloads expected async work with `commit()` or `discard()`.

**Errors**: Bubble to nearest error boundary.

