## Git

Git operations within a Sandbox.

```python
# Clone, stage, commit, push
sandbox.git.clone("https://github.com/user/repo.git", "workspace/repo", branch="develop")
sandbox.git.add("workspace/repo", ["file.txt"])
sandbox.git.commit("workspace/repo", "Update", "John Doe", "john@example.com")
sandbox.git.push("workspace/repo", username="user", password="token")

# Status and branches
status = sandbox.git.status("workspace/repo")  # current_branch, file_status, ahead, behind, branch_published
sandbox.git.branches("workspace/repo")

# Branch operations
sandbox.git.checkout_branch("workspace/repo", "feature-branch")
sandbox.git.create_branch("workspace/repo", "new-feature")
sandbox.git.delete_branch("workspace/repo", "old-feature")

# Pull changes
sandbox.git.pull("workspace/repo", username="user", password="token")
```

All paths are relative to sandbox working directory.