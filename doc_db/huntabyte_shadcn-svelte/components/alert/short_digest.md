## Alert

Displays a callout for user attention.

### Installation

```bash
npx shadcn-svelte@latest add alert -y -o
```

### Usage

```svelte
<script lang="ts">
  import * as Alert from "$lib/components/ui/alert/index.js";
  import CheckCircle2Icon from "@lucide/svelte/icons/check-circle-2";
  import AlertCircleIcon from "@lucide/svelte/icons/alert-circle";
</script>

<Alert.Root>
  <CheckCircle2Icon />
  <Alert.Title>Success!</Alert.Title>
  <Alert.Description>Your changes have been saved.</Alert.Description>
</Alert.Root>

<Alert.Root variant="destructive">
  <AlertCircleIcon />
  <Alert.Title>Error</Alert.Title>
  <Alert.Description>Your session has expired. Please login again.</Alert.Description>
</Alert.Root>
```

Compose with `Alert.Root`, `Alert.Title`, and `Alert.Description`. Supports `variant="destructive"` for error states.