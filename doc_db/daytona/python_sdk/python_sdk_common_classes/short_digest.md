**Charts**: Base `Chart` with type/title/elements/png; `Chart2D` adds axis labels; `PointChart`/`LineChart`/`ScatterChart` for point data; `BarChart` for categorical; `PieChart`; `BoxAndWhiskerChart` for distributions; `CompositeChart` for subplots.

**Errors**: `DaytonaError` base with message/status_code/headers; subclasses `DaytonaNotFoundError`, `DaytonaRateLimitError`, `DaytonaTimeoutError`.

**Image**: Chainable builder with factories `base()`, `from_dockerfile()`, `debian_slim()`; methods `.pip_install()`, `.pip_install_from_requirements()`, `.pip_install_from_pyproject()`, `.add_local_file()`, `.add_local_dir()`, `.workdir()`, `.env()`, `.run_commands()`, `.entrypoint()`, `.cmd()`, `.dockerfile_commands()`, `.dockerfile()`.