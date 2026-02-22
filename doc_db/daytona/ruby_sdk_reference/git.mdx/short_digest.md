## Git Handler

Git operations class for sandbox repositories.

### Key Methods

```ruby
# Clone repository
sandbox.git.clone(url: "...", path: "workspace/repo", branch: "develop", commit_id: "abc123", username: "user", password: "token")

# Stage, commit, push
sandbox.git.add("workspace/repo", ["file.txt"])
sha = sandbox.git.commit(path: "workspace/repo", message: "msg", author: "Name", email: "email@example.com", allow_empty: true).sha
sandbox.git.push("workspace/repo", username: "user", password: "token")

# Pull, status, branches
sandbox.git.pull("workspace/repo", username: "user", password: "token")
status = sandbox.git.status("workspace/repo")  # current_branch, ahead, behind
branches = sandbox.git.branches("workspace/repo")

# Branch operations
sandbox.git.checkout_branch("workspace/repo", "feature-branch")
sandbox.git.create_branch("workspace/repo", "new-feature")
sandbox.git.delete_branch("workspace/repo", "old-feature")
```

All methods raise `Daytona:Sdk:Error` on failure. Paths are relative to sandbox working directory.