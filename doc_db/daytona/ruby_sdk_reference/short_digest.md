**Installation:** `gem 'daytona'` with `Daytona::Config` for API key/JWT auth.

**Sandbox lifecycle:** `daytona.create()`, `sandbox.start()`, `sandbox.stop()`, `sandbox.archive()`, `daytona.delete()`, `daytona.get(id)`, `daytona.find_one()`, `daytona.list()`.

**Process execution:** `sandbox.process.exec(command)`, `code_run(code)`, sessions with `create_session()`, PTY with `create_pty_session()`.

**File system:** `sandbox.fs.upload_file()`, `download_file()`, `list_files()`, `find_files()`, `replace_in_files()`, `move_files()`, `set_file_permissions()`.

**Git:** `sandbox.git.clone()`, `add()`, `commit()`, `push()`, `pull()`, `status()`, `branches()`, `checkout_branch()`.

**Desktop/VNC:** `sandbox.computer_use.start()`, `stop()`, `status()`, process control, mouse/keyboard/screenshot interfaces.

**LSP:** `sandbox.create_lsp_server()` with `start()`, `did_open()`, `completions()`, `document_symbols()`, `sandbox_symbols()`.

**Images/Snapshots:** `Image.debian_slim().pip_install().add_local_file()...`, `daytona.snapshot.create()`, `list()`, `get()`, `delete()`, `activate()`.

**Volumes:** `daytona.volume.create()`, `get()`, `list()`, `delete()`.

**Network:** `sandbox.preview_url()`, `create_signed_preview_url()`, `create_ssh_access()`.

**Properties:** `sandbox.id`, `state`, `cpu`, `memory`, `disk`, `labels`, `auto_stop_interval=`, `resize()`.

**Object storage:** `ObjectStorage.upload(path, org_id, archive_path)` → file hash.