## AsyncGit

Async Git operations for Sandbox: clone, add, commit, push, pull, status, and branch management (create, checkout, delete, list).

```python
# Clone and setup
await sandbox.git.clone(url="https://github.com/user/repo.git", path="workspace/repo",
                        branch="develop", username="user", password="token")

# Stage, commit, push
await sandbox.git.add("workspace/repo", ["file.txt", "src/main.py"])
await sandbox.git.commit(path="workspace/repo", message="Update", 
                         author="John Doe", email="john@example.com")
await sandbox.git.push("workspace/repo", username="user", password="token")

# Branch operations
await sandbox.git.create_branch("workspace/repo", "feature")
await sandbox.git.checkout_branch("workspace/repo", "feature")
await sandbox.git.delete_branch("workspace/repo", "old-feature")

# Status and info
status = await sandbox.git.status("workspace/repo")  # current_branch, ahead, behind, branch_published
branches = await sandbox.git.branches("workspace/repo")  # list branches
```

All paths relative to sandbox working directory. Returns: `GitCommitResponse` (sha), `GitStatus`, `ListBranchResponse`.