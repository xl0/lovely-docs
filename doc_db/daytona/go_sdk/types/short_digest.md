## Core Types

**Configuration**: DaytonaConfig with API credentials, URL, organization, and experimental features (OpenTelemetry)

**Sandbox Creation**: SandboxBaseParams (name, user, language, env vars, labels, auto-stop/archive/delete intervals, volumes, network settings), ImageParams (extends with image and resources), SnapshotParams (extends with snapshot ID)

**Snapshots**: CreateSnapshotParams, Snapshot (full metadata), PaginatedSnapshots

**Code Execution**: CodeRunParams (argv, env), ExecuteResponse (exit code, result, artifacts), ExecutionResult (stdout, stderr, charts, error), ExecutionError (name, value, traceback), ExecutionArtifacts (stdout, charts)

**Charts**: Chart (type, title, elements, optional base64 PNG), ChartType (line, scatter, bar, pie, box_and_whisker, composite_chart, unknown)

**Files**: FileUpload (source, destination), FileDownloadRequest/Response, FileInfo (name, size, mode, modified time, is directory)

**PTY**: PtySessionInfo (ID, active, CWD, dimensions, process ID, created at), PtySize (rows, cols), PtyResult (exit code, error)

**Git**: GitStatus (branch, ahead/behind, published, file statuses), GitCommitResponse (SHA), FileStatus (path, status)

**Volumes**: Volume (ID, name, organization, state, error, timestamps), VolumeMount (volume ID, mount path, optional subpath)

**Resources**: CPU, GPU, Memory, Disk allocation

**Screenshots**: ScreenshotOptions (cursor, format, quality, scale), ScreenshotRegion (x, y, width, height), ScreenshotResponse (base64 image, dimensions, size)

**Languages**: CodeLanguage and LspLanguageID (python, javascript, typescript)