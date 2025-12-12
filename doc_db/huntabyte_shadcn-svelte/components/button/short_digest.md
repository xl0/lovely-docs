## Button

Displays a button or component that looks like a button.

### Installation

```bash
npx shadcn-svelte@latest add button -y -o
```

### Usage

```svelte
<script lang="ts">
  import { Button } from "$lib/components/ui/button/index.js";
  import { buttonVariants } from "$lib/components/ui/button";
</script>

<!-- Variants: default, secondary, destructive, outline, ghost, link -->
<Button variant="outline">Outline</Button>

<!-- Link button -->
<Button href="/dashboard">Dashboard</Button>
<a href="/dashboard" class={buttonVariants({ variant: "outline" })}>Dashboard</a>

<!-- With icon -->
<Button variant="outline" size="sm">
  <GitBranchIcon />
  Login
</Button>

<!-- Icon only -->
<Button variant="secondary" size="icon" class="size-8">
  <ChevronRightIcon />
</Button>

<!-- Loading state -->
<Button disabled>
  <Spinner />
  Please wait
</Button>
```