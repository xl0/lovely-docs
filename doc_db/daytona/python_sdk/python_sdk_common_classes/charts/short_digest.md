## Chart Types

Base `Chart` class with `type`, `title`, `elements`, and optional base64 `png`.

**Specialized types:**
- `Chart2D`: adds `x_label`, `y_label`
- `PointChart(Chart2D)`: point-based data with axis ticks/scales, contains `PointData` elements
- `LineChart(PointChart)`, `ScatterChart(PointChart)`: point chart variants
- `BarChart(Chart2D)`: categorical data with `BarData` elements (label, group, value)
- `PieChart(Chart)`: pie slices with `PieData` (label, angle, radius, autopct)
- `BoxAndWhiskerChart(Chart2D)`: statistical distribution with `BoxAndWhiskerData` (min, quartiles, median, max, outliers)
- `CompositeChart(Chart)`: container for multiple nested charts

All inherit from `BaseModel`. `Chart.to_dict()` returns metadata dictionary.