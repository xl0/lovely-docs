## ExecuteResponse

Response object returned from command execution.

**Properties**:
- `artifacts?` _ExecutionArtifacts_ - Optional artifacts generated during execution
- `exitCode` _number_ - Exit code from the executed command
- `result` _string_ - Command output as string

## ExecutionArtifacts

Container for artifacts produced by command execution.

**Properties**:
- `charts?` _Chart[]_ - Optional list of chart metadata from matplotlib
- `stdout` _string_ - Standard output from command (same as `result` in ExecuteResponse)