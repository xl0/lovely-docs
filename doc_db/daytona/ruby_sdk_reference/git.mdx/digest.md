## Git Handler

Main class for Git operations in a sandbox environment.

### Constructor

```ruby
Git.new(sandbox_id:, toolbox_api:, otel_state:)
```

Initializes a Git handler with sandbox context and API client.

### Properties

- `sandbox_id()` - Returns the Sandbox ID
- `toolbox_api()` - Returns the DaytonaToolboxApiClient:GitApi instance

### Methods

#### clone(url:, path:, branch:, commit_id:, username:, password:)

Clones a Git repository to the specified path. Supports cloning specific branches or commits, with optional authentication.

```ruby
# Clone default branch
sandbox.git.clone(url: "https://github.com/user/repo.git", path: "workspace/repo")

# Clone specific branch with authentication
sandbox.git.clone(
  url: "https://github.com/user/private-repo.git",
  path: "workspace/private",
  branch: "develop",
  username: "user",
  password: "token"
)

# Clone specific commit (detached HEAD)
sandbox.git.clone(url: "https://github.com/user/repo.git", path: "workspace/repo-old", commit_id: "abc123")
```

#### add(path, files)

Stages files for commit (equivalent to `git add`).

```ruby
sandbox.git.add("workspace/repo", ["file.txt"])
sandbox.git.add("workspace/repo", ["src/main.rb", "spec/main_spec.rb", "README.md"])
```

#### commit(path:, message:, author:, email:, allow_empty:)

Creates a commit with staged changes. Returns `GitCommitResponse` with the commit SHA.

```ruby
sandbox.git.add("workspace/repo", ["README.md"])
response = sandbox.git.commit(
  path: "workspace/repo",
  message: "Update documentation",
  author: "John Doe",
  email: "john@example.com",
  allow_empty: true
)
puts response.sha
```

#### push(path:, username:, password:)

Pushes local commits to remote repository. Authentication optional.

```ruby
sandbox.git.push("workspace/repo")
sandbox.git.push(path: "workspace/repo", username: "user", password: "github_token")
```

#### pull(path:, username:, password:)

Pulls changes from remote repository. Authentication optional.

```ruby
sandbox.git.pull("workspace/repo")
sandbox.git.pull(path: "workspace/repo", username: "user", password: "github_token")
```

#### status(path)

Returns repository status including current branch, commits ahead/behind.

```ruby
status = sandbox.git.status("workspace/repo")
puts "On branch: #{status.current_branch}"
puts "Commits ahead: #{status.ahead}"
puts "Commits behind: #{status.behind}"
```

#### branches(path)

Lists all branches in the repository.

```ruby
response = sandbox.git.branches("workspace/repo")
puts "Branches: #{response.branches}"
```

#### checkout_branch(path, branch)

Checks out a branch.

```ruby
sandbox.git.checkout_branch("workspace/repo", "feature-branch")
```

#### create_branch(path, name)

Creates a new branch.

```ruby
sandbox.git.create_branch("workspace/repo", "new-feature")
```

#### delete_branch(path, name)

Deletes a branch.

```ruby
sandbox.git.delete_branch("workspace/repo", "old-feature")
```

### Error Handling

All methods raise `Daytona:Sdk:Error` on failure. Relative paths are resolved from the sandbox working directory.