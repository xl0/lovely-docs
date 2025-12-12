# Field

Accessible form field component for combining labels, controls, and help text. Supports vertical, horizontal, and responsive layouts with validation states.

## Installation

```bash
npx shadcn-svelte@latest add field -y -o
```

## Components

- `Field.Set` - Wrapper for related fields with optional legend
- `Field.Group` - Container for stacking fields
- `Field.Field` - Core wrapper for a single field
- `Field.Label` - Label element
- `Field.Description` - Helper text
- `Field.Error` - Validation error message
- `Field.Legend` - Semantic heading for field groups
- `Field.Separator` - Visual divider between field groups
- `Field.Content` - Flex column grouping label and description
- `Field.Title` - Title for choice cards

## Basic Usage

```svelte
<script lang="ts">
  import * as Field from "$lib/components/ui/field/index.js";
  import { Input } from "$lib/components/ui/input/index.js";
</script>

<Field.Set>
  <Field.Legend>Profile</Field.Legend>
  <Field.Description>This appears on invoices and emails.</Field.Description>
  <Field.Group>
    <Field.Field>
      <Field.Label for="name">Full name</Field.Label>
      <Input id="name" placeholder="Evil Rabbit" />
      <Field.Description>This appears on invoices and emails.</Field.Description>
    </Field.Field>
    <Field.Field>
      <Field.Label for="username">Username</Field.Label>
      <Input id="username" aria-invalid />
      <Field.Error>Choose another username.</Field.Error>
    </Field.Field>
  </Field.Group>
</Field.Set>
```

## Layouts

### Vertical (Default)
Stacks label, control, and helper text vertically. Ideal for mobile-first layouts.

### Horizontal
Set `orientation="horizontal"` on `Field` to align label and control side-by-side:

```svelte
<Field.Field orientation="horizontal">
  <Checkbox id="newsletter" />
  <Field.Label for="newsletter">Subscribe to newsletter</Field.Label>
</Field.Field>
```

### Responsive
Set `orientation="responsive"` for automatic column layouts. Apply `@container/field-group` classes on `FieldGroup` to switch orientations at breakpoints:

```svelte
<Field.Group>
  <Field.Field orientation="responsive">
    <Field.Content>
      <Field.Label for="name">Name</Field.Label>
      <Field.Description>Provide your full name</Field.Description>
    </Field.Content>
    <Input id="name" placeholder="Evil Rabbit" />
  </Field.Field>
</Field.Group>
```

## Examples

### Input Fields
```svelte
<Field.Set>
  <Field.Group>
    <Field.Field>
      <Field.Label for="username">Username</Field.Label>
      <Input id="username" type="text" placeholder="Max Leiter" />
      <Field.Description>Choose a unique username for your account.</Field.Description>
    </Field.Field>
    <Field.Field>
      <Field.Label for="password">Password</Field.Label>
      <Field.Description>Must be at least 8 characters long.</Field.Description>
      <Input id="password" type="password" placeholder="********" />
    </Field.Field>
  </Field.Group>
</Field.Set>
```

### Textarea
```svelte
<Field.Set>
  <Field.Group>
    <Field.Field>
      <Field.Label for="feedback">Feedback</Field.Label>
      <Textarea id="feedback" placeholder="Your feedback helps us improve..." rows={4} />
      <Field.Description>Share your thoughts about our service.</Field.Description>
    </Field.Field>
  </Field.Group>
</Field.Set>
```

### Select
```svelte
<script lang="ts">
  let department = $state<string>();
  const departments = [
    { value: "engineering", label: "Engineering" },
    { value: "design", label: "Design" },
    { value: "marketing", label: "Marketing" },
  ];
  const departmentLabel = $derived(
    departments.find((d) => d.value === department)?.label ?? "Choose department"
  );
</script>

<Field.Field>
  <Field.Label for="department">Department</Field.Label>
  <Select.Root type="single" bind:value={department}>
    <Select.Trigger id="department">{departmentLabel}</Select.Trigger>
    <Select.Content>
      {#each departments as dept (dept.value)}
        <Select.Item {...dept} />
      {/each}
    </Select.Content>
  </Select.Root>
  <Field.Description>Select your department or area of work.</Field.Description>
</Field.Field>
```

### Slider
```svelte
<script lang="ts">
  let value = $state([200, 800]);
</script>

<Field.Field>
  <Field.Label>Price Range</Field.Label>
  <Field.Description>
    Set your budget range ($<span class="font-medium">{value[0]}</span> - <span class="font-medium">{value[1]}</span>).
  </Field.Description>
  <Slider type="multiple" bind:value max={1000} min={0} step={10} class="mt-2 w-full" aria-label="Price Range" />
</Field.Field>
```

### Checkbox Group
```svelte
<Field.Group>
  <Field.Set>
    <Field.Legend variant="label">Show these items on the desktop</Field.Legend>
    <Field.Description>Select the items you want to show on the desktop.</Field.Description>
    <Field.Group class="gap-3">
      <Field.Field orientation="horizontal">
        <Checkbox id="hard-disks" checked />
        <Field.Label for="hard-disks" class="font-normal">Hard disks</Field.Label>
      </Field.Field>
      <Field.Field orientation="horizontal">
        <Checkbox id="external-disks" />
        <Field.Label for="external-disks" class="font-normal">External disks</Field.Label>
      </Field.Field>
    </Field.Group>
  </Field.Set>
  <Field.Separator />
  <Field.Field orientation="horizontal">
    <Checkbox id="sync-folders" checked />
    <Field.Content>
      <Field.Label for="sync-folders">Sync Desktop & Documents folders</Field.Label>
      <Field.Description>Your folders are being synced with iCloud Drive.</Field.Description>
    </Field.Content>
  </Field.Field>
</Field.Group>
```

### Radio Group
```svelte
<script lang="ts">
  let plan = $state("monthly");
</script>

<Field.Set>
  <Field.Label>Subscription Plan</Field.Label>
  <Field.Description>Yearly and lifetime plans offer significant savings.</Field.Description>
  <RadioGroup.Root bind:value={plan}>
    <Field.Field orientation="horizontal">
      <RadioGroup.Item value="monthly" id="plan-monthly" />
      <Field.Label for="plan-monthly" class="font-normal">Monthly ($9.99/month)</Field.Label>
    </Field.Field>
    <Field.Field orientation="horizontal">
      <RadioGroup.Item value="yearly" id="plan-yearly" />
      <Field.Label for="plan-yearly" class="font-normal">Yearly ($99.99/year)</Field.Label>
    </Field.Field>
  </RadioGroup.Root>
</Field.Set>
```

### Switch
```svelte
<Field.Field orientation="horizontal">
  <Field.Content>
    <Field.Label for="2fa">Multi-factor authentication</Field.Label>
    <Field.Description>Enable multi-factor authentication for added security.</Field.Description>
  </Field.Content>
  <Switch id="2fa" />
</Field.Field>
```

### Choice Card
Wrap `Field` components inside `FieldLabel` to create selectable field groups with radio items, checkboxes, or switches:

```svelte
<script lang="ts">
  let computeEnvironment = $state("kubernetes");
</script>

<Field.Group>
  <Field.Set>
    <Field.Label for="compute-environment">Compute Environment</Field.Label>
    <Field.Description>Select the compute environment for your cluster.</Field.Description>
    <RadioGroup.Root bind:value={computeEnvironment}>
      <Field.Label for="kubernetes">
        <Field.Field orientation="horizontal">
          <Field.Content>
            <Field.Title>Kubernetes</Field.Title>
            <Field.Description>Run GPU workloads on a K8s configured cluster.</Field.Description>
          </Field.Content>
          <RadioGroup.Item value="kubernetes" id="kubernetes" />
        </Field.Field>
      </Field.Label>
      <Field.Label for="vm">
        <Field.Field orientation="horizontal">
          <Field.Content>
            <Field.Title>Virtual Machine</Field.Title>
            <Field.Description>Access a VM configured cluster to run GPU workloads.</Field.Description>
          </Field.Content>
          <RadioGroup.Item value="vm" id="vm" />
        </Field.Field>
      </Field.Label>
    </RadioGroup.Root>
  </Field.Set>
</Field.Group>
```

### Field Groups with Separators
```svelte
<Field.Group>
  <Field.Set>
    <Field.Label>Responses</Field.Label>
    <Field.Description>Get notified when ChatGPT responds to requests.</Field.Description>
    <Field.Group data-slot="checkbox-group">
      <Field.Field orientation="horizontal">
        <Checkbox id="push" checked disabled />
        <Field.Label for="push" class="font-normal">Push notifications</Field.Label>
      </Field.Field>
    </Field.Group>
  </Field.Set>
  <Field.Separator />
  <Field.Set>
    <Field.Label>Tasks</Field.Label>
    <Field.Description>Get notified when tasks you've created have updates.</Field.Description>
    <Field.Group data-slot="checkbox-group">
      <Field.Field orientation="horizontal">
        <Checkbox id="push-tasks" />
        <Field.Label for="push-tasks" class="font-normal">Push notifications</Field.Label>
      </Field.Field>
      <Field.Field orientation="horizontal">
        <Checkbox id="email-tasks" />
        <Field.Label for="email-tasks" class="font-normal">Email notifications</Field.Label>
      </Field.Field>
    </Field.Group>
  </Field.Set>
</Field.Group>
```

### Complex Form (Payment)
```svelte
<script lang="ts">
  let month = $state<string>();
  let year = $state<string>();
</script>

<form>
  <Field.Group>
    <Field.Set>
      <Field.Legend>Payment Method</Field.Legend>
      <Field.Description>All transactions are secure and encrypted</Field.Description>
      <Field.Group>
        <Field.Field>
          <Field.Label for="card-name">Name on Card</Field.Label>
          <Input id="card-name" placeholder="Evil Rabbit" required />
        </Field.Field>
        <Field.Field>
          <Field.Label for="card-number">Card Number</Field.Label>
          <Input id="card-number" placeholder="1234 5678 9012 3456" required />
          <Field.Description>Enter your 16-digit card number</Field.Description>
        </Field.Field>
        <div class="grid grid-cols-3 gap-4">
          <Field.Field>
            <Field.Label for="exp-month">Month</Field.Label>
            <Select.Root type="single" bind:value={month}>
              <Select.Trigger id="exp-month"><span>{month || "MM"}</span></Select.Trigger>
              <Select.Content>
                {#each Array.from({length: 12}, (_, i) => String(i + 1).padStart(2, '0')) as m}
                  <Select.Item value={m}>{m}</Select.Item>
                {/each}
              </Select.Content>
            </Select.Root>
          </Field.Field>
          <Field.Field>
            <Field.Label for="exp-year">Year</Field.Label>
            <Select.Root type="single" bind:value={year}>
              <Select.Trigger id="exp-year"><span>{year || "YYYY"}</span></Select.Trigger>
              <Select.Content>
                {#each [2024, 2025, 2026, 2027, 2028, 2029] as y}
                  <Select.Item value={String(y)}>{y}</Select.Item>
                {/each}
              </Select.Content>
            </Select.Root>
          </Field.Field>
          <Field.Field>
            <Field.Label for="cvv">CVV</Field.Label>
            <Input id="cvv" placeholder="123" required />
          </Field.Field>
        </div>
      </Field.Group>
    </Field.Set>
    <Field.Separator />
    <Field.Set>
      <Field.Legend>Billing Address</Field.Legend>
      <Field.Description>The billing address associated with your payment method</Field.Description>
      <Field.Group>
        <Field.Field orientation="horizontal">
          <Checkbox id="same-as-shipping" checked={true} />
          <Field.Label for="same-as-shipping" class="font-normal">Same as shipping address</Field.Label>
        </Field.Field>
      </Field.Group>
    </Field.Set>
    <Field.Separator />
    <Field.Set>
      <Field.Group>
        <Field.Field>
          <Field.Label for="comments">Comments</Field.Label>
          <Textarea id="comments" placeholder="Add any additional comments" class="resize-none" />
        </Field.Field>
      </Field.Group>
    </Field.Set>
    <Field.Field orientation="horizontal">
      <Button type="submit">Submit</Button>
      <Button variant="outline" type="button">Cancel</Button>
    </Field.Field>
  </Field.Group>
</form>
```

## Validation and Errors

Add `data-invalid` to `Field` to switch the entire block into an error state. Add `aria-invalid` on the input itself for assistive technologies. Render `Field.Error` immediately after the control or inside `Field.Content`:

```svelte
<Field.Field data-invalid>
  <Field.Label for="email">Email</Field.Label>
  <Input id="email" type="email" aria-invalid />
  <Field.Error>Enter a valid email address.</Field.Error>
</Field.Field>
```

## Accessibility

- `Field.Set` and `Field.Legend` keep related controls grouped for keyboard and assistive tech users
- `Field` outputs `role="group"` so nested controls inherit labeling from `Field.Label` and `Field.Legend`
- Apply `Field.Separator` sparingly to ensure screen readers encounter clear section boundaries
