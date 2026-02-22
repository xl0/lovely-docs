## AsyncGit

Async Git operations class for executing Git commands within a Sandbox.

### Initialization

```python
class AsyncGit()
def __init__(api_client: GitApi)
```

Initializes with a GitApi client for Sandbox Git operations.

### Core Operations

#### clone
```python
async def clone(url: str, path: str, branch: str | None = None, 
                commit_id: str | None = None, username: str | None = None, 
                password: str | None = None) -> None
```
Clones a repository. Supports specific branches, commits, and authentication.

```python
# Default branch
await sandbox.git.clone(url="https://github.com/user/repo.git", path="workspace/repo")

# Specific branch with auth
await sandbox.git.clone(url="https://github.com/user/private-repo.git", 
                        path="workspace/private", branch="develop", 
                        username="user", password="token")

# Specific commit (detached HEAD)
await sandbox.git.clone(url="https://github.com/user/repo.git", 
                        path="workspace/repo-old", commit_id="abc123")
```

#### add
```python
async def add(path: str, files: list[str]) -> None
```
Stages files for commit (like `git add`).

```python
await sandbox.git.add("workspace/repo", ["file.txt"])
await sandbox.git.add("workspace/repo", ["src/main.py", "tests/test_main.py", "README.md"])
```

#### commit
```python
async def commit(path: str, message: str, author: str, email: str, 
                 allow_empty: bool = False) -> GitCommitResponse
```
Creates a commit with staged changes. Returns `GitCommitResponse` with `sha` attribute.

```python
await sandbox.git.add("workspace/repo", ["README.md"])
await sandbox.git.commit(path="workspace/repo", message="Update documentation",
                         author="John Doe", email="john@example.com", allow_empty=True)
```

#### push
```python
async def push(path: str, username: str | None = None, 
               password: str | None = None) -> None
```
Pushes local commits to remote. Optional authentication for private repos.

```python
await sandbox.git.push("workspace/repo")
await sandbox.git.push(path="workspace/repo", username="user", password="github_token")
```

#### pull
```python
async def pull(path: str, username: str | None = None, 
               password: str | None = None) -> None
```
Pulls changes from remote. Optional authentication.

```python
await sandbox.git.pull("workspace/repo")
await sandbox.git.pull(path="workspace/repo", username="user", password="github_token")
```

#### status
```python
async def status(path: str) -> GitStatus
```
Returns repository status with fields: `current_branch`, `file_status`, `ahead`, `behind`, `branch_published`.

```python
status = await sandbox.git.status("workspace/repo")
print(f"On branch: {status.current_branch}")
print(f"Commits ahead: {status.ahead}, behind: {status.behind}")
```

### Branch Operations

#### branches
```python
async def branches(path: str) -> ListBranchResponse
```
Lists all branches in repository.

```python
response = await sandbox.git.branches("workspace/repo")
print(f"Branches: {response.branches}")
```

#### create_branch
```python
async def create_branch(path: str, name: str) -> None
```
Creates a new branch.

```python
await sandbox.git.create_branch("workspace/repo", "new-feature")
```

#### checkout_branch
```python
async def checkout_branch(path: str, branch: str) -> None
```
Checks out a branch.

```python
await sandbox.git.checkout_branch("workspace/repo", "feature-branch")
```

#### delete_branch
```python
async def delete_branch(path: str, name: str) -> None
```
Deletes a branch.

```python
await sandbox.git.delete_branch("workspace/repo", "old-feature")
```

### Response Types

**GitCommitResponse**: Contains `sha` (commit SHA hash)

**GitStatus**: Contains `current_branch`, `file_status`, `ahead`, `behind`, `branch_published`

**ListBranchResponse**: Contains `branches` list

### Notes

- All paths are relative to sandbox working directory unless absolute
- File paths in `add()` are relative to repository root
- All methods use error interception with descriptive prefixes
- All methods are instrumented for monitoring