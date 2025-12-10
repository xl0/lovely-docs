## $effect

Effects are functions that run when state updates. They only run in the browser, not during server-side rendering. Generally avoid updating state inside effects as it leads to convoluted code and infinite loops.

### Basic Usage

```svelte
<script>
    let size = $state(50);
    let color = $state('#ff3e00');
    let canvas;

    $effect(() => {
        const context = canvas.getContext('2d');
        context.clearRect(0, 0, canvas.width, canvas.height);
        context.fillStyle = color;
        context.fillRect(0, 0, size, size);
    });
</script>

<canvas bind:this={canvas} width="100" height="100"></canvas>
```

Svelte tracks which state is accessed in the effect and re-runs it when that state changes.

### Lifecycle

Effects run after component mount and in a microtask after state changes. Re-runs are batched. Effects can return a teardown function that runs before re-runs and on component destruction:

```svelte
<script>
    let count = $state(0);
    let milliseconds = $state(1000);

    $effect(() => {
        const interval = setInterval(() => {
            count += 1;
        }, milliseconds);

        return () => clearInterval(interval);
    });
</script>

<h1>{count}</h1>
<button onclick={() => (milliseconds *= 2)}>slower</button>
<button onclick={() => (milliseconds /= 2)}>faster</button>
```

### Understanding Dependencies

Effects automatically track reactive values ($state, $derived, $props) read synchronously. Asynchronously read values (after await or setTimeout) are not tracked:

```ts
$effect(() => {
    context.fillStyle = color; // tracked
    setTimeout(() => {
        context.fillRect(0, 0, size, size); // size not tracked
    }, 0);
});
```

Effects only re-run when the object itself changes, not when properties inside it change:

```svelte
<script>
    let state = $state({ value: 0 });
    let derived = $derived({ value: state.value * 2 });

    $effect(() => {
        state; // runs once, state never reassigned
    });

    $effect(() => {
        state.value; // runs when state.value changes
    });

    $effect(() => {
        derived; // runs each time (new object)
    });
</script>

<button onclick={() => (state.value += 1)}>{state.value}</button>
<p>{state.value} doubled is {derived.value}</p>
```

Effects only depend on values read in the last run. Conditional code affects dependencies:

```ts
let condition = $state(true);
let color = $state('#ff3e00');

$effect(() => {
    if (condition) {
        confetti({ colors: [color] }); // color is dependency
    } else {
        confetti(); // color not a dependency here
    }
});
```

### $effect.pre

Runs code before DOM updates:

```svelte
<script>
    import { tick } from 'svelte';
    let div = $state();
    let messages = $state([]);

    $effect.pre(() => {
        if (!div) return;
        messages.length; // reference to re-run on changes
        if (div.offsetHeight + div.scrollTop > div.scrollHeight - 20) {
            tick().then(() => {
                div.scrollTo(0, div.scrollHeight);
            });
        }
    });
</script>

<div bind:this={div}>
    {#each messages as message}
        <p>{message}</p>
    {/each}
</div>
```

### $effect.tracking

Returns whether code is running in a tracking context (effect or template):

```svelte
<script>
    console.log('setup:', $effect.tracking()); // false
    $effect(() => {
        console.log('in effect:', $effect.tracking()); // true
    });
</script>

<p>in template: {$effect.tracking()}</p> <!-- true -->
```

Used to implement abstractions that only track when values are being tracked.

### $effect.root

Creates a non-tracked scope with manual cleanup, useful for nested effects outside component initialization:

```js
const destroy = $effect.root(() => {
    $effect(() => {
        // setup
    });
    return () => {
        // cleanup
    };
});

destroy();
```

### When Not to Use $effect

Don't use effects to synchronize state. Instead of:

```svelte
<script>
    let count = $state(0);
    let doubled = $state();
    $effect(() => {
        doubled = count * 2;
    });
</script>
```

Use $derived:

```svelte
<script>
    let count = $state(0);
    let doubled = $derived(count * 2);
</script>
```

For complex expressions, use $derived.by. Deriveds can be directly overridden as of Svelte 5.25.

Don't use effects to link values. Instead of effects, use oninput callbacks or function bindings:

```svelte
<script>
    const total = 100;
    let spent = $state(0);
    let left = $derived(total - spent);

    function updateLeft(value) {
        spent = total - value;
    }
</script>

<label>
    <input type="range" bind:value={spent} max={total} />
    {spent}/{total} spent
</label>

<label>
    <input type="range" bind:value={() => left, updateLeft} max={total} />
    {left}/{total} left
</label>
```

If you must update $state in an effect and hit infinite loops, use untrack.