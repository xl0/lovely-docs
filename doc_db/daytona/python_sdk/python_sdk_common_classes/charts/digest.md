## Chart

Base class representing a chart with matplotlib metadata.

```python
class Chart(BaseModel):
    type: ChartType
    title: str
    elements: list[Any]
    png: str | None  # base64 encoded
    
    def to_dict() -> dict[str, Any]:
        """Return metadata dictionary used to create the chart"""
```

## ChartType

Enum of supported chart types:
- `LINE`, `SCATTER`, `BAR`, `PIE`, `BOX_AND_WHISKER`, `COMPOSITE_CHART`, `UNKNOWN`

## Chart2D

Extends Chart with axis labels:
```python
class Chart2D(Chart):
    x_label: str | None
    y_label: str | None
```

## PointChart

2D chart for point-based data (extends Chart2D):
```python
class PointChart(Chart2D):
    x_ticks: list[str | float]
    x_tick_labels: list[str]
    x_scale: str
    y_ticks: list[str | float]
    y_tick_labels: list[str]
    y_scale: str
    elements: list[PointData]

class PointData(BaseModel):
    label: str
    points: list[tuple[str | float, str | float]]
```

## LineChart & ScatterChart

Specialized PointChart subclasses:
```python
class LineChart(PointChart):
    type: ChartType

class ScatterChart(PointChart):
    type: ChartType
```

## BarChart

2D chart for categorical data (extends Chart2D):
```python
class BarChart(Chart2D):
    type: ChartType
    elements: list[BarData]

class BarData(BaseModel):
    label: str
    group: str
    value: str
```

## PieChart

Pie chart with slice data:
```python
class PieChart(Chart):
    type: ChartType
    elements: list[PieData]

class PieData(BaseModel):
    label: str
    angle: float
    radius: float
    autopct: str | float
```

## BoxAndWhiskerChart

Statistical chart for distribution data (extends Chart2D):
```python
class BoxAndWhiskerChart(Chart2D):
    type: ChartType
    elements: list[BoxAndWhiskerData]

class BoxAndWhiskerData(BaseModel):
    label: str
    min: float
    first_quartile: float
    median: float
    third_quartile: float
    max: float
    outliers: list[float]
```

## CompositeChart

Container for multiple charts (subplots):
```python
class CompositeChart(Chart):
    type: ChartType
    elements: list[Chart]  # nested charts
```