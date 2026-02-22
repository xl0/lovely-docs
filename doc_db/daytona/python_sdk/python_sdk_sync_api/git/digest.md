## Git

Provides Git operations within a Sandbox via the `Git` class.

### Git.__init__

```python
def __init__(api_client: GitApi)
```

Initializes a Git handler instance with an API client.

### Git.clone

```python
sandbox.git.clone(
    url="https://github.com/user/repo.git",
    path="workspace/repo",
    branch="develop",  # optional
    commit_id="abc123",  # optional
    username="user",  # optional
    password="token"  # optional
)
```

Clones a Git repository. Supports cloning specific branches or commits, with optional authentication.

### Git.add

```python
sandbox.git.add("workspace/repo", ["file.txt", "src/main.py"])
```

Stages files for the next commit (equivalent to `git add`).

### Git.commit

```python
sandbox.git.commit(
    path="workspace/repo",
    message="Update documentation",
    author="John Doe",
    email="john@example.com",
    allow_empty=True  # optional, defaults to False
)
```

Creates a new commit with staged changes. Returns `GitCommitResponse` with the commit SHA.

### Git.push

```python
sandbox.git.push("workspace/repo", username="user", password="token")
```

Pushes local commits on the current branch to the remote repository. Authentication is optional.

### Git.pull

```python
sandbox.git.pull("workspace/repo", username="user", password="token")
```

Pulls changes from the remote repository. Authentication is optional.

### Git.status

```python
status = sandbox.git.status("workspace/repo")
# Returns GitStatus with:
# - current_branch: Current branch name
# - file_status: List of file statuses
# - ahead: Number of local commits not pushed
# - behind: Number of remote commits not pulled
# - branch_published: Whether branch is published to remote
```

Gets the current repository status.

### Git.branches

```python
response = sandbox.git.branches("workspace/repo")
# Returns ListBranchResponse with list of branches
```

Lists all branches in the repository.

### Git.checkout_branch

```python
sandbox.git.checkout_branch("workspace/repo", "feature-branch")
```

Checks out a branch.

### Git.create_branch

```python
sandbox.git.create_branch("workspace/repo", "new-feature")
```

Creates a new branch.

### Git.delete_branch

```python
sandbox.git.delete_branch("workspace/repo", "old-feature")
```

Deletes a branch.

### GitCommitResponse

```python
class GitCommitResponse()
```

Response from commit operation with `sha` attribute containing the commit SHA.

### Path Resolution

All path arguments are relative to the sandbox working directory unless absolute.