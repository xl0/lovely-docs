## Git Operations

Daytona provides built-in Git support through the `git` module in sandboxes. Paths are relative to the sandbox working directory (WORKDIR from Dockerfile, or home directory if not specified), but absolute paths starting with `/` are also supported.

### Clone Repositories

Clone public or private repositories with optional authentication and branch selection:

```python
# Python
sandbox.git.clone("https://github.com/user/repo.git", "workspace/repo")
sandbox.git.clone("https://github.com/user/repo.git", "workspace/repo", 
                  username="git", password="token", branch="develop")
```

```typescript
// TypeScript
await sandbox.git.clone("https://github.com/user/repo.git", "workspace/repo");
await sandbox.git.clone("https://github.com/user/repo.git", "workspace/repo",
                        "develop", undefined, "git", "token");
```

```ruby
# Ruby
sandbox.git.clone(url: 'https://github.com/user/repo.git', path: 'workspace/repo',
                  username: 'git', password: 'token', branch: 'develop')
```

```go
// Go
sandbox.Git.Clone(ctx, "https://github.com/user/repo.git", "workspace/repo")
sandbox.Git.Clone(ctx, "https://github.com/user/repo.git", "workspace/repo",
                  options.WithUsername("git"), options.WithPassword("token"), 
                  options.WithBranch("develop"))
```

API: `POST /git/clone` with `url`, `path`, `branch`, `username`, `password`, `commit_id`

### Repository Status

Get current branch, commits ahead/behind, and file status; list branches:

```python
status = sandbox.git.status("workspace/repo")
print(f"Branch: {status.current_branch}, Ahead: {status.ahead}, Behind: {status.behind}")
for file in status.file_status:
    print(f"File: {file.name}")
branches = sandbox.git.branches("workspace/repo")
```

```typescript
const status = await sandbox.git.status("workspace/repo");
console.log(`Branch: ${status.currentBranch}, Ahead: ${status.ahead}, Behind: ${status.behind}`);
const response = await sandbox.git.branches("workspace/repo");
```

```ruby
status = sandbox.git.status('workspace/repo')
puts "Branch: #{status.current_branch}, Ahead: #{status.ahead}, Behind: #{status.behind}"
response = sandbox.git.branches('workspace/repo')
```

```go
status, _ := sandbox.Git.Status(ctx, "workspace/repo")
fmt.Printf("Branch: %s, Ahead: %d, Behind: %d\n", status.CurrentBranch, status.Ahead, status.Behind)
branches, _ := sandbox.Git.Branches(ctx, "workspace/repo")
```

API: `GET /git/status?path=`

### Branch Operations

Create, checkout, and delete branches:

```python
sandbox.git.create_branch("workspace/repo", "new-feature")
sandbox.git.checkout_branch("workspace/repo", "feature-branch")
sandbox.git.delete_branch("workspace/repo", "old-feature")
```

```typescript
await git.createBranch('workspace/repo', 'new-feature');
await git.checkoutBranch('workspace/repo', 'feature-branch');
await git.deleteBranch('workspace/repo', 'old-feature');
```

```ruby
sandbox.git.create_branch('workspace/repo', 'new-feature')
sandbox.git.checkout_branch('workspace/repo', 'feature-branch')
sandbox.git.delete_branch('workspace/repo', 'old-feature')
```

```go
sandbox.Git.CreateBranch(ctx, "workspace/repo", "new-feature")
sandbox.Git.Checkout(ctx, "workspace/repo", "feature-branch")
sandbox.Git.DeleteBranch(ctx, "workspace/repo", "old-feature")
```

API: `POST /git/branches` (create), `POST /git/checkout` (checkout), `DELETE /git/branches` (delete)

### Stage and Commit Changes

Stage files and commit with author information:

```python
sandbox.git.add("workspace/repo", ["file.txt", "src/main.py", "README.md"])
sandbox.git.commit(path="workspace/repo", message="Update docs", 
                   author="John Doe", email="john@example.com", allow_empty=True)
```

```typescript
await git.add('workspace/repo', ['file.txt', '.']);
await git.commit('workspace/repo', 'Update docs', 'John Doe', 'john@example.com', true);
```

```ruby
sandbox.git.add('workspace/repo', ['file.txt'])
sandbox.git.commit('workspace/repo', 'Update docs', 'John Doe', 'john@example.com', true)
```

```go
sandbox.Git.Add(ctx, "workspace/repo", []string{"file.txt", "."})
response, _ := sandbox.Git.Commit(ctx, "workspace/repo", "Update docs", 
                                  "John Doe", "john@example.com", 
                                  options.WithAllowEmpty(true))
fmt.Printf("Commit SHA: %s\n", response.SHA)
```

API: `POST /git/add` with `files` array and `path`; `POST /git/commit` with `message`, `author`, `email`, `allow_empty`, `path`

### Push and Pull Changes

Push to and pull from remote repositories with optional authentication:

```python
sandbox.git.push("workspace/repo")
sandbox.git.push(path="workspace/repo", username="user", password="token")
sandbox.git.pull("workspace/repo")
sandbox.git.pull(path="workspace/repo", username="user", password="token")
```

```typescript
await git.push('workspace/repo');
await git.push('workspace/repo', 'user', 'token');
await git.pull('workspace/repo');
await git.pull('workspace/repo', 'user', 'token');
```

```ruby
sandbox.git.push('workspace/repo')
sandbox.git.pull('workspace/repo')
```

```go
sandbox.Git.Push(ctx, "workspace/repo")
sandbox.Git.Push(ctx, "workspace/repo", options.WithPushUsername("user"), 
                 options.WithPushPassword("token"))
sandbox.Git.Pull(ctx, "workspace/repo")
sandbox.Git.Pull(ctx, "workspace/repo", options.WithPullUsername("user"), 
                 options.WithPullPassword("token"))
```

API: `POST /git/push` and `POST /git/pull` with `path`, `username`, `password`