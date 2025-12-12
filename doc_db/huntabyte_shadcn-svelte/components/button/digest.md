## Button

Displays a button or a component that looks like a button.

### Installation

```bash
npx shadcn-svelte@latest add button -y -o
```

The `-y` flag skips the confirmation prompt, and `-o` overwrites existing files.

### Basic Usage

```svelte
<script lang="ts">
  import { Button } from "$lib/components/ui/button/index.js";
</script>

<!-- Default (primary) -->
<Button>Button</Button>

<!-- Variants -->
<Button variant="secondary">Secondary</Button>
<Button variant="destructive">Destructive</Button>
<Button variant="outline">Outline</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="link">Link</Button>
```

### Link Button

Convert button to an `<a>` element by passing `href` prop:

```svelte
<Button href="/dashboard">Dashboard</Button>
```

Or use `buttonVariants` helper to style a link as a button:

```svelte
<script lang="ts">
  import { buttonVariants } from "$lib/components/ui/button";
</script>

<a href="/dashboard" class={buttonVariants({ variant: "outline" })}>
  Dashboard
</a>
```

### With Icons

```svelte
<script lang="ts">
  import GitBranchIcon from "@lucide/svelte/icons/git-branch";
  import ChevronRightIcon from "@lucide/svelte/icons/chevron-right";
  import { Button } from "$lib/components/ui/button/index.js";
</script>

<!-- Icon with text -->
<Button variant="outline" size="sm">
  <GitBranchIcon />
  Login with Email
</Button>

<!-- Icon only -->
<Button variant="secondary" size="icon" class="size-8">
  <ChevronRightIcon />
</Button>
```

### Loading State

Use Spinner component to indicate loading:

```svelte
<script lang="ts">
  import { Button } from "$lib/components/ui/button/index.js";
  import { Spinner } from "$lib/components/ui/spinner/index.js";
</script>

<Button disabled>
  <Spinner />
  Please wait
</Button>
```

See Bits UI Button docs for full API reference.