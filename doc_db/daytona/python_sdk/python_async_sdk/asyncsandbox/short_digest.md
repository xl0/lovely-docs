## AsyncSandbox

Async interface for Daytona Sandboxes with attributes for file system, git, process execution, computer use, and code interpretation.

**Lifecycle**: `start()`, `stop()`, `recover()`, `delete()`, `archive()`

**Configuration**: `set_autostop_interval()`, `set_auto_archive_interval()`, `set_auto_delete_interval()`, `resize(Resources)`, `set_labels()`

**Info**: `refresh_data()`, `get_user_home_dir()`, `get_work_dir()`, `refresh_activity()`

**Preview/Access**: `get_preview_link()`, `create_signed_preview_url()`, `create_ssh_access()`, `create_lsp_server()`

**Attributes**: id, name, state, cpu, memory, disk, gpu, env, labels, public, auto_stop/archive/delete intervals, backup state, created/updated timestamps, network settings

**Resources**: Dataclass with cpu, memory, disk, gpu fields for resizing