

## Pages

### charts
Chart class hierarchy for matplotlib visualization: base Chart with type/title/elements/png, specialized 2D variants (PointChart, BarChart, BoxAndWhiskerChart), PieChart, and CompositeChart for subplots.

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

### errors
SDK exception classes: DaytonaError (base with message/status_code/headers), DaytonaNotFoundError, DaytonaRateLimitError, DaytonaTimeoutError

## DaytonaError

Base exception class for SDK errors.

```python
class DaytonaError(Exception):
    def __init__(message: str,
                 status_code: int | None = None,
                 headers: Mapping[str, Any] | None = None)
```

**Attributes**:
- `message` - Error message string
- `status_code` - HTTP status code if available
- `headers` - Response headers dictionary

## DaytonaNotFoundError

Raised when a resource is not found.

```python
class DaytonaNotFoundError(DaytonaError)
```

## DaytonaRateLimitError

Raised when rate limit is exceeded.

```python
class DaytonaRateLimitError(DaytonaError)
```

## DaytonaTimeoutError

Raised when a timeout occurs.

```python
class DaytonaTimeoutError(DaytonaError)
```

### image
Chainable Image class for building Daytona sandbox images with package installation, file operations, and Docker configuration.

## Image

Represents an image definition for a Daytona sandbox. Do not construct directly; use static factory methods.

### Factory Methods

```python
# From existing base image
Image.base("python:3.12-slim-bookworm")

# From Dockerfile
Image.from_dockerfile("Dockerfile")

# Debian slim with Python
Image.debian_slim("3.12")
```

### Package Installation

```python
# Install packages
Image.debian_slim("3.12").pip_install("requests", "pandas")

# From requirements.txt
Image.debian_slim("3.12").pip_install_from_requirements("requirements.txt")

# From pyproject.toml with optional dependencies
Image.debian_slim("3.12").pip_install_from_pyproject(
    "pyproject.toml", 
    optional_dependencies=["dev"]
)
```

All pip methods support: `find_links`, `index_url`, `extra_index_urls`, `pre` (pre-release), `extra_options`.

### File Operations

```python
# Add single file
Image.debian_slim("3.12").add_local_file("package.json", "/home/daytona/package.json")

# Add directory
Image.debian_slim("3.12").add_local_dir("src", "/home/daytona/src")
```

### Image Configuration

```python
image = Image.debian_slim("3.12")
    .workdir("/home/daytona")
    .env({"PROJECT_ROOT": "/home/daytona"})
    .run_commands('echo "Hello, world!"', ['bash', '-c', 'echo Hello, world, again!'])
    .entrypoint(["/bin/bash"])
    .cmd(["/bin/bash"])
    .dockerfile_commands(["RUN echo 'Hello, world!'"], context_dir=None)
```

### Methods

- `dockerfile()` - Returns generated Dockerfile string
- `pip_install(*packages, find_links, index_url, extra_index_urls, pre, extra_options)` - Install packages
- `pip_install_from_requirements(requirements_txt, ...)` - Install from requirements file
- `pip_install_from_pyproject(pyproject_toml, optional_dependencies, ...)` - Install from pyproject.toml
- `add_local_file(local_path, remote_path)` - Add file to image
- `add_local_dir(local_path, remote_path)` - Add directory to image
- `run_commands(*commands)` - Execute commands in image
- `env(env_vars)` - Set environment variables
- `workdir(path)` - Set working directory
- `entrypoint(entrypoint_commands)` - Set entrypoint
- `cmd(cmd)` - Set default command
- `dockerfile_commands(dockerfile_commands, context_dir)` - Add raw Dockerfile commands

All methods return `Image` for chaining.

## Context

```python
class Context(BaseModel)
```

Context for an image with attributes:
- `source_path` (str) - Path to source file or directory
- `archive_path` (str | None) - Path inside archive file in object storage

