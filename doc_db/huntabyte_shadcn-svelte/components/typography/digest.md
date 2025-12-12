## Typography

No typography styles are shipped by default. Use utility classes to style text elements.

### Heading Styles

**h1** - Large primary heading
```svelte
<h1 class="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
  Taxing Laughter: The Joke Tax Chronicles
</h1>
```

**h2** - Secondary heading with bottom border
```svelte
<h2 class="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0">
  The People of the Kingdom
</h2>
```

**h3** - Tertiary heading
```svelte
<h3 class="scroll-m-20 text-2xl font-semibold tracking-tight">The Joke Tax</h3>
```

**h4** - Quaternary heading
```svelte
<h4 class="scroll-m-20 text-xl font-semibold tracking-tight">
  People stopped telling jokes
</h4>
```

### Paragraph Styles

**p** - Standard paragraph with margin between non-first siblings
```svelte
<p class="leading-7 [&:not(:first-child)]:mt-6">
  The king, seeing how much happier his subjects were, realized the error of his ways and repealed the joke tax.
</p>
```

**Lead** - Large introductory text
```svelte
<p class="text-muted-foreground text-xl">
  A modal dialog that interrupts the user with important content and expects a response.
</p>
```

**Large** - Emphasized text
```svelte
<div class="text-lg font-semibold">Are you sure absolutely sure?</div>
```

**Small** - Reduced size text
```svelte
<small class="text-sm font-medium leading-none">Email address</small>
```

**Muted** - Subdued secondary text
```svelte
<p class="text-muted-foreground text-sm">Enter your email address.</p>
```

### Block Elements

**Blockquote** - Indented quoted text with left border
```svelte
<blockquote class="mt-6 border-s-2 ps-6 italic">
  "After all," he said, "everyone enjoys a good joke, so it's only fair that they should pay for the privilege."
</blockquote>
```

**Unordered List** - Bulleted list with spacing
```svelte
<ul class="my-6 ms-6 list-disc [&>li]:mt-2">
  <li>1st level of puns: 5 gold coins</li>
  <li>2nd level of jokes: 10 gold coins</li>
  <li>3rd level of one-liners: 20 gold coins</li>
</ul>
```

**Table** - Responsive table with borders and alternating row backgrounds
```svelte
<div class="my-6 w-full overflow-y-auto">
  <table class="w-full">
    <thead>
      <tr class="even:bg-muted m-0 border-t p-0">
        <th class="border px-4 py-2 text-start font-bold [&[align=center]]:text-center [&[align=right]]:text-end">
          King's Treasury
        </th>
        <th class="border px-4 py-2 text-start font-bold [&[align=center]]:text-center [&[align=right]]:text-end">
          People's happiness
        </th>
      </tr>
    </thead>
    <tbody>
      <tr class="even:bg-muted m-0 border-t p-0">
        <td class="border px-4 py-2 text-start [&[align=center]]:text-center [&[align=right]]:text-end">Empty</td>
        <td class="border px-4 py-2 text-start [&[align=center]]:text-center [&[align=right]]:text-end">Overflowing</td>
      </tr>
    </tbody>
  </table>
</div>
```

**Inline Code** - Monospace code snippet
```svelte
<code class="bg-muted relative rounded px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold">
  @lucide/svelte
</code>
```

### Key Utility Classes

- `scroll-m-20` - Scroll margin for anchor links
- `text-balance` - Balanced text wrapping
- `text-muted-foreground` - Muted text color
- `leading-7` - Line height
- `[&:not(:first-child)]:mt-6` - Margin on non-first children
- `border-s-2` - Start border (left in LTR)
- `ps-6` - Padding start
- `[&[align=center]]:text-center` - Conditional alignment styling
