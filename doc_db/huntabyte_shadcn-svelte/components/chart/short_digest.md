# Chart

Beautiful, customizable charts built on LayerChart. Copy-paste components.

## Installation

```bash
npx shadcn-svelte@latest add chart -y -o
```

## Basic Usage

```svelte
<script lang="ts">
  import * as Chart from "$lib/components/ui/chart/index.js";
  import { BarChart } from "layerchart";
  import { scaleBand } from "d3-scale";

  const chartData = [
    { month: "January", desktop: 186, mobile: 80 },
    { month: "February", desktop: 305, mobile: 200 }
  ];

  const chartConfig = {
    desktop: { label: "Desktop", color: "#2563eb" },
    mobile: { label: "Mobile", color: "#60a5fa" }
  } satisfies Chart.ChartConfig;
</script>

<Chart.Container config={chartConfig} class="min-h-[200px] w-full">
  <BarChart
    data={chartData}
    xScale={scaleBand().padding(0.25)}
    x="month"
    axis="x"
    seriesLayout="group"
    legend
    series={[
      { key: "desktop", label: chartConfig.desktop.label, color: chartConfig.desktop.color },
      { key: "mobile", label: chartConfig.mobile.label, color: chartConfig.mobile.color }
    ]}
    props={{ xAxis: { format: (d) => d.slice(0, 3) } }}
  >
    {#snippet tooltip()}
      <Chart.Tooltip />
    {/snippet}
  </BarChart>
</Chart.Container>
```

## Chart Config

Decoupled from data. Holds labels, icons, colors. Supports theme objects for light/dark:

```svelte
const chartConfig = {
  desktop: {
    label: "Desktop",
    icon: MonitorIcon,
    color: "#2563eb",
    theme: { light: "#2563eb", dark: "#dc2626" }
  }
} satisfies Chart.ChartConfig;
```

## Theming

Use CSS variables (recommended) or direct colors (hex, hsl, oklch):

```css
:root { --chart-1: oklch(0.646 0.222 41.116); }
.dark { --chart-1: oklch(0.488 0.243 264.376); }
```

Reference with `var(--chart-1)` in config or `var(--color-KEY)` in components/data.

## Tooltip

`Chart.Tooltip` component with customizable label, name, indicator (dot/line/dashed), and value. Colors auto-referenced from config.

Props: `labelKey`, `nameKey`, `indicator`, `hideLabel`, `hideIndicator`, `label`, `labelFormatter`, `formatter`.

Use `labelKey` and `nameKey` to map custom data keys to tooltip display.