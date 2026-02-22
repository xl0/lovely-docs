## Type Definitions

### Configuration
- **DaytonaConfig**: Client configuration with APIKey, JWTToken, OrganizationID, APIUrl, Target, and optional ExperimentalConfig (OtelEnabled for OpenTelemetry)

### Sandbox Creation Parameters
- **SandboxBaseParams**: Common sandbox parameters including Name, User, CodeLanguage (python/javascript/typescript), EnvVars, Labels, Public flag, AutoStop/Archive/Delete intervals (nil=disabled, 0=immediate), Volumes, NetworkBlockAll, NetworkAllowList, Ephemeral
- **ImageParams**: Extends SandboxBaseParams with Image (string or *Image) and Resources
- **SnapshotParams**: Extends SandboxBaseParams with Snapshot identifier

### Snapshot Management
- **CreateSnapshotParams**: Name, Image (string or *Image), Resources, Entrypoint, SkipValidation
- **Snapshot**: Full snapshot metadata with ID, OrganizationID, General flag, Name, ImageName, State, Size, Entrypoint, CPU/GPU/Memory/Disk, ErrorReason, SkipValidation, CreatedAt, UpdatedAt, LastUsedAt
- **PaginatedSnapshots**: Items ([]*Snapshot), Total, Page, TotalPages

### Code Execution
- **CodeRunParams**: Argv ([]string), Env (map[string]string)
- **ExecuteResponse**: ExitCode, Result string, Artifacts (*ExecutionArtifacts)
- **ExecutionResult**: Stdout, Stderr, Charts ([]Chart), Error (*ExecutionError)
- **ExecutionError**: Name, Value, Traceback (*string optional)
- **ExecutionArtifacts**: Stdout, Charts ([]Chart)

### Charts
- **Chart**: Type (ChartType), Title, Elements (any), PNG (*string optional base64)
- **ChartType**: line, scatter, bar, pie, box_and_whisker, composite_chart, unknown

### File Operations
- **FileUpload**: Source ([]byte or string path), Destination
- **FileDownloadRequest**: Source, Destination (*string; nil=memory, non-nil=file path)
- **FileDownloadResponse**: Source, Result ([]byte or string path), Error (*string)
- **FileInfo**: Name, Size, Mode, ModifiedTime, IsDirectory

### PTY Sessions
- **PtySessionInfo**: ID, Active, CWD, Cols, Rows, ProcessID (*int optional), CreatedAt
- **PtySize**: Rows, Cols
- **PtyResult**: ExitCode (*int; nil=running), Error (*string)

### Git Operations
- **GitStatus**: CurrentBranch, Ahead, Behind, BranchPublished, FileStatus ([]FileStatus)
- **GitCommitResponse**: SHA
- **FileStatus**: Path, Status

### Volumes
- **Volume**: ID, Name, OrganizationID, State, ErrorReason (*string), CreatedAt, UpdatedAt, LastUsedAt
- **VolumeMount**: VolumeID, MountPath, Subpath (*string optional)

### Resources
- **Resources**: CPU, GPU, Memory, Disk (all int)

### Screenshots
- **ScreenshotOptions**: ShowCursor (*bool), Format (*string), Quality (*int 0-100), Scale (*float64)
- **ScreenshotRegion**: X, Y, Width, Height
- **ScreenshotResponse**: Image (base64), Width, Height, SizeBytes (*int)

### Language Support
- **CodeLanguage**: python, javascript, typescript
- **LspLanguageID**: python, javascript, typescript

### Utilities
- **Position**: Line, Character (both zero-based)
- **OutputMessage**: Type, Text, Name, Value, Traceback (JSON serializable)