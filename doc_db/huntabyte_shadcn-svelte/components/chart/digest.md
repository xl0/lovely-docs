# Chart

Beautiful, customizable charts built on LayerChart. Copy-paste components into your apps.

**Note:** LayerChart v2 is in pre-release with potential breaking changes. Track development at the LayerChart PR #449.

## Installation

```bash
npx shadcn-svelte@latest add chart -y -o
```

Flags: `-y` skips confirmation, `-o` overwrites existing files.

## Component Design

Charts use composition with LayerChart components. You build charts using LayerChart's components and only import custom components like `ChartTooltip` when needed.

```svelte
<script lang="ts">
  import * as Chart from "$lib/components/ui/chart/index.js";
  import { BarChart } from "layerchart";
  const data = [/* ... */];
</script>
<Chart.Container>
  <BarChart {data} x="date" y="value">
    {#snippet tooltip()}
      <Chart.Tooltip />
    {/snippet}
  </BarChart>
</Chart.Container>
```

No wrapping of LayerChart—you're not locked into an abstraction. Follow official LayerChart upgrade paths directly.

## Building Your First Chart

### Data and Config

Define your data in any shape. Use `dataKey` prop to map data to the chart.

```svelte
<script lang="ts">
  import * as Chart from "$lib/components/ui/chart/index.js";
  import { scaleBand } from "d3-scale";
  import { BarChart } from "layerchart";

  const chartData = [
    { month: "January", desktop: 186, mobile: 80 },
    { month: "February", desktop: 305, mobile: 200 },
    { month: "March", desktop: 237, mobile: 120 },
    { month: "April", desktop: 73, mobile: 190 },
    { month: "May", desktop: 209, mobile: 130 },
    { month: "June", desktop: 214, mobile: 140 }
  ];

  const chartConfig = {
    desktop: {
      label: "Desktop",
      color: "#2563eb"
    },
    mobile: {
      label: "Mobile",
      color: "#60a5fa"
    }
  } satisfies Chart.ChartConfig;
</script>
```

### Building the Chart

```svelte
<Chart.Container config={chartConfig} class="min-h-[200px] w-full">
  <BarChart
    data={chartData}
    xScale={scaleBand().padding(0.25)}
    x="month"
    axis="x"
    seriesLayout="group"
    legend
    series={[
      {
        key: "desktop",
        label: chartConfig.desktop.label,
        color: chartConfig.desktop.color
      },
      {
        key: "mobile",
        label: chartConfig.mobile.label,
        color: chartConfig.mobile.color
      }
    ]}
    props={{
      xAxis: {
        format: (d) => d.slice(0, 3)
      }
    }}
  >
    {#snippet tooltip()}
      <Chart.Tooltip />
    {/snippet}
  </BarChart>
</Chart.Container>
```

Use the `props` prop to pass custom props to chart components (e.g., custom formatters for axes).

## Chart Config

The chart config holds labels, icons, and colors. It's decoupled from chart data, allowing config reuse across charts.

```svelte
<script lang="ts">
  import MonitorIcon from "@lucide/svelte/icons/monitor";
  import * as Chart from "$lib/components/ui/chart/index.js";

  const chartConfig = {
    desktop: {
      label: "Desktop",
      icon: MonitorIcon,
      color: "#2563eb",
      // OR use theme object for light/dark
      theme: {
        light: "#2563eb",
        dark: "#dc2626"
      }
    }
  } satisfies Chart.ChartConfig;
</script>
```

## Theming

### CSS Variables (Recommended)

Define colors in CSS:

```css
:root {
  --chart-1: oklch(0.646 0.222 41.116);
  --chart-2: oklch(0.6 0.118 184.704);
}
.dark {
  --chart-1: oklch(0.488 0.243 264.376);
  --chart-2: oklch(0.696 0.17 162.48);
}
```

Reference in config:

```svelte
<script lang="ts">
  const chartConfig = {
    desktop: {
      label: "Desktop",
      color: "var(--chart-1)"
    },
    mobile: {
      label: "Mobile",
      color: "var(--chart-2)"
    }
  } satisfies Chart.ChartConfig;
</script>
```

### Direct Colors

Use hex, hsl, or oklch directly:

```svelte
<script lang="ts">
  const chartConfig = {
    desktop: {
      label: "Desktop",
      color: "#2563eb"
    }
  } satisfies Chart.ChartConfig;
</script>
```

### Using Colors

Reference theme colors with `var(--color-KEY)`:

```svelte
<Bar fill="var(--color-desktop)" />
```

In chart data:

```ts
const chartData = [
  { browser: "chrome", visitors: 275, color: "var(--color-chrome)" },
  { browser: "safari", visitors: 200, color: "var(--color-safari)" }
];
```

In Tailwind:

```svelte
<Label class="fill-(--color-desktop)" />
```

## Tooltip

The `Chart.Tooltip` component displays label, name, indicator, and value. Colors are automatically referenced from chart config.

### Props

| Prop | Type | Description |
|------|------|-------------|
| `labelKey` | string | Config or data key for label |
| `nameKey` | string | Config or data key for name |
| `indicator` | `dot` \| `line` \| `dashed` | Indicator style |
| `hideLabel` | boolean | Hide the label |
| `hideIndicator` | boolean | Hide the indicator |
| `label` | string | Custom label text |
| `labelFormatter` | function | Format the label |
| `formatter` | Snippet | Custom tooltip rendering |

### Custom Keys

```svelte
<script lang="ts">
  const chartData = [
    { browser: "chrome", visitors: 187 },
    { browser: "safari", visitors: 200 }
  ];

  const chartConfig = {
    visitors: {
      label: "Total Visitors"
    },
    chrome: {
      label: "Chrome",
      color: "var(--chart-1)"
    },
    safari: {
      label: "Safari",
      color: "var(--chart-2)"
    }
  } satisfies Chart.ChartConfig;
</script>

<Chart.Tooltip labelKey="visitors" nameKey="browser" />
```

This uses "Total Visitors" for the label and "Chrome"/"Safari" for tooltip names.