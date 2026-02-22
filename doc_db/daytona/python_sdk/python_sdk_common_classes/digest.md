## Chart Classes

Base `Chart` class with `type`, `title`, `elements`, and optional `png` (base64). `ChartType` enum: `LINE`, `SCATTER`, `BAR`, `PIE`, `BOX_AND_WHISKER`, `COMPOSITE_CHART`, `UNKNOWN`.

`Chart2D` extends Chart with `x_label` and `y_label`.

`PointChart` (extends Chart2D) for point-based data with `x_ticks`, `x_tick_labels`, `x_scale`, `y_ticks`, `y_tick_labels`, `y_scale`, and `elements: list[PointData]` where `PointData` has `label` and `points: list[tuple[str | float, str | float]]`. `LineChart` and `ScatterChart` are specialized subclasses.

`BarChart` (extends Chart2D) with `elements: list[BarData]` where `BarData` has `label`, `group`, `value`.

`PieChart` with `elements: list[PieData]` where `PieData` has `label`, `angle`, `radius`, `autopct`.

`BoxAndWhiskerChart` (extends Chart2D) with `elements: list[BoxAndWhiskerData]` containing `label`, `min`, `first_quartile`, `median`, `third_quartile`, `max`, `outliers: list[float]`.

`CompositeChart` for subplots with `elements: list[Chart]` (nested charts).

## Error Classes

`DaytonaError` base exception with `message`, `status_code`, `headers`. Subclasses: `DaytonaNotFoundError`, `DaytonaRateLimitError`, `DaytonaTimeoutError`.

## Image Class

Chainable builder for sandbox images. Factory methods: `Image.base("python:3.12-slim-bookworm")`, `Image.from_dockerfile("Dockerfile")`, `Image.debian_slim("3.12")`.

Package installation: `.pip_install("requests", "pandas")`, `.pip_install_from_requirements("requirements.txt")`, `.pip_install_from_pyproject("pyproject.toml", optional_dependencies=["dev"])`. All support `find_links`, `index_url`, `extra_index_urls`, `pre`, `extra_options`.

File operations: `.add_local_file("package.json", "/home/daytona/package.json")`, `.add_local_dir("src", "/home/daytona/src")`.

Configuration: `.workdir("/home/daytona")`, `.env({"PROJECT_ROOT": "/home/daytona"})`, `.run_commands('echo "Hello"', ['bash', '-c', 'echo Hello'])`, `.entrypoint(["/bin/bash"])`, `.cmd(["/bin/bash"])`, `.dockerfile_commands(["RUN echo 'Hello'"], context_dir=None)`.

Methods: `dockerfile()` returns Dockerfile string. All builder methods return `Image` for chaining.

`Context` model with `source_path` (str) and `archive_path` (str | None).