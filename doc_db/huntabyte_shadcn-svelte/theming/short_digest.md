## Theming with CSS Variables

Customize colors using CSS variables with `background`/`foreground` convention. The `background` suffix is omitted in utility classes.

```css
:root {
  --primary: oklch(0.205 0 0);
  --primary-foreground: oklch(0.985 0 0);
}
```

```svelte
<div class="bg-primary text-primary-foreground">Hello</div>
```

### Adding Custom Colors

```css
:root {
  --warning: oklch(0.84 0.16 84);
  --warning-foreground: oklch(0.28 0.07 46);
}

.dark {
  --warning: oklch(0.41 0.11 46);
  --warning-foreground: oklch(0.99 0.02 95);
}

@theme inline {
  --color-warning: var(--warning);
  --color-warning-foreground: var(--warning-foreground);
}
```

Use: `<div class="bg-warning text-warning-foreground"></div>`

### Available Variables

Standard set: radius, background, foreground, card, popover, primary, secondary, muted, accent, destructive, border, input, ring, chart-1 through chart-5, sidebar variants. All support light and dark modes using OKLCH color space.

### Base Color Presets

Pre-configured schemes: Neutral, Stone, Zinc, Gray, Slate with light/dark variants.