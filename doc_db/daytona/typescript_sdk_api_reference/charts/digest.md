## ChartType Enum

Defines chart types: `BAR`, `LINE`, `PIE`, `SCATTER`, `UNKNOWN`

## parseChart()

```ts
function parseChart(data: any): Chart
```

Parses raw data into a Chart object.

## Base Types

### Chart
```ts
type Chart = {
  elements: any[];
  png?: string;
  title: string;
  type: ChartType;
};
```
Base chart type with metadata. PNG is base64-encoded.

### Chart2D
Extends Chart with axis labels:
```ts
type Chart2D = Chart & {
  x_label?: string;
  y_label?: string;
};
```

## Bar Chart

```ts
type BarChart = Chart2D & {
  elements: BarData[];
  type: BAR;
};

type BarData = {
  group: string;
  label: string;
  value: string;
};
```

## Box and Whisker Chart

```ts
type BoxAndWhiskerChart = Chart2D & {
  elements: BoxAndWhiskerData[];
  type: BOX_AND_WHISKER;
};

type BoxAndWhiskerData = {
  first_quartile: number;
  label: string;
  max: number;
  median: number;
  min: number;
  outliers: number[];
};
```

## Pie Chart

```ts
type PieChart = Chart & {
  elements: PieData[];
  type: PIE;
};

type PieData = {
  angle: number;
  label: string;
  radius: number;
};
```

## Point-Based Charts

### PointChart (base for Line and Scatter)
```ts
type PointChart = Chart2D & {
  elements: PointData[];
  x_scale: string;
  x_tick_labels: string[];
  x_ticks: (number | string)[];
  y_scale: string;
  y_tick_labels: string[];
  y_ticks: (number | string)[];
};

type PointData = {
  label: string;
  points: [number | string, number | string][];
};
```

### LineChart
```ts
type LineChart = PointChart & {
  type: LINE;
};
```

### ScatterChart
```ts
type ScatterChart = PointChart & {
  type: SCATTER;
};
```

## Composite Chart

```ts
type CompositeChart = Chart & {
  elements: Chart[];
  type: COMPOSITE_CHART;
};
```

Allows nesting multiple charts together.