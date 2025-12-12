## Alert

Displays a callout for user attention.

### Installation

```bash
npx shadcn-svelte@latest add alert -y -o
```

The `-y` flag skips the confirmation prompt, and `-o` overwrites existing files.

### Usage

```svelte
<script lang="ts">
  import * as Alert from "$lib/components/ui/alert/index.js";
  import CheckCircle2Icon from "@lucide/svelte/icons/check-circle-2";
  import AlertCircleIcon from "@lucide/svelte/icons/alert-circle";
</script>

<!-- Default alert with title and description -->
<Alert.Root>
  <CheckCircle2Icon />
  <Alert.Title>Success! Your changes have been saved</Alert.Title>
  <Alert.Description>This is an alert with icon, title and description.</Alert.Description>
</Alert.Root>

<!-- Alert with title and icon only -->
<Alert.Root>
  <CheckCircle2Icon />
  <Alert.Title>This Alert has a title and an icon. No description.</Alert.Title>
</Alert.Root>

<!-- Destructive variant with complex content -->
<Alert.Root variant="destructive">
  <AlertCircleIcon />
  <Alert.Title>Unable to process your payment.</Alert.Title>
  <Alert.Description>
    <p>Please verify your billing information and try again.</p>
    <ul class="list-inside list-disc text-sm">
      <li>Check your card details</li>
      <li>Ensure sufficient funds</li>
      <li>Verify billing address</li>
    </ul>
  </Alert.Description>
</Alert.Root>
```

### Components

- `Alert.Root`: Container for the alert
- `Alert.Title`: Alert title
- `Alert.Description`: Alert description (optional)

### Variants

- `default`: Standard alert styling
- `destructive`: Error/warning styling for destructive actions or errors