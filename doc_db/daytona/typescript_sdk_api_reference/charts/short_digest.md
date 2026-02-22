## Chart Types

`BAR`, `LINE`, `PIE`, `SCATTER`, `UNKNOWN` via `ChartType` enum.

## parseChart()

```ts
function parseChart(data: any): Chart
```

## Core Types

**Chart**: Base type with `elements`, `png` (base64), `title`, `type`

**Chart2D**: Extends Chart with `x_label`, `y_label`

**BarChart**: Chart2D with `BarData[]` elements (group, label, value)

**PieChart**: Chart with `PieData[]` elements (angle, label, radius)

**PointChart**: Chart2D with `PointData[]` elements, axis scales/ticks/labels
- **LineChart**: PointChart with type LINE
- **ScatterChart**: PointChart with type SCATTER

**BoxAndWhiskerChart**: Chart2D with `BoxAndWhiskerData[]` (quartiles, median, min/max, outliers)

**CompositeChart**: Chart with nested `Chart[]` elements