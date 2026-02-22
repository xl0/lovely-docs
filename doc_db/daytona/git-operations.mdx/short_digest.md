## Git Operations

Clone, manage branches, stage/commit, and push/pull changes in sandboxes.

**Clone**: `git.clone(url, path, branch?, username?, password?)`

**Status**: `git.status(path)` returns current branch, ahead/behind counts, file status; `git.branches(path)` lists branches

**Branches**: `git.create_branch(path, name)`, `git.checkout_branch(path, name)`, `git.delete_branch(path, name)`

**Stage & Commit**: `git.add(path, files)`, `git.commit(path, message, author, email, allow_empty?)`

**Remote**: `git.push(path, username?, password?)`, `git.pull(path, username?, password?)`

All operations support Python, TypeScript, Ruby, Go SDKs and REST API. Paths relative to sandbox WORKDIR or home directory; absolute paths with `/` prefix supported.