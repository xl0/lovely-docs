## Git

Provides Git operations within a Sandbox.

### Constructor

```ts
new Git(apiClient: GitApi): Git
```

### Methods

#### add()

Stages files for the next commit.

```ts
add(path: string, files: string[]): Promise<void>
```

- `path`: Path to Git repository root (relative to sandbox working directory)
- `files`: List of file paths or directories to stage, relative to repository root

```ts
await git.add('workspace/repo', ['file.txt']);
await git.add('workspace/repo', ['.']); // Stage whole repository
```

#### branches()

Lists branches in the repository.

```ts
branches(path: string): Promise<ListBranchResponse>
```

```ts
const response = await git.branches('workspace/repo');
console.log(`Branches: ${response.branches}`);
```

#### checkoutBranch()

Checks out a branch.

```ts
checkoutBranch(path: string, branch: string): Promise<void>
```

```ts
await git.checkoutBranch('workspace/repo', 'new-feature');
```

#### clone()

Clones a Git repository. Supports specific branches, commits, and authentication.

```ts
clone(
  url: string, 
  path: string, 
  branch?: string, 
  commitId?: string, 
  username?: string, 
  password?: string
): Promise<void>
```

```ts
// Default branch
await git.clone('https://github.com/user/repo.git', 'workspace/repo');

// Specific branch with authentication
await git.clone(
  'https://github.com/user/private-repo.git',
  'workspace/private',
  'develop',
  undefined,
  'user',
  'token'
);

// Specific commit (detached HEAD)
await git.clone(
  'https://github.com/user/repo.git',
  'workspace/repo-old',
  undefined,
  'abc123'
);
```

#### commit()

Commits staged changes.

```ts
commit(
  path: string, 
  message: string, 
  author: string, 
  email: string, 
  allowEmpty?: boolean
): Promise<GitCommitResponse>
```

- `allowEmpty`: Allow creating an empty commit when no changes are staged

```ts
await git.add('workspace/repo', ['README.md']);
await git.commit(
  'workspace/repo',
  'Update documentation',
  'John Doe',
  'john@example.com',
  true
);
```

Returns `GitCommitResponse` with `sha` property (commit SHA).

#### createBranch()

Creates a new branch.

```ts
createBranch(path: string, name: string): Promise<void>
```

```ts
await git.createBranch('workspace/repo', 'new-feature');
```

#### deleteBranch()

Deletes a branch.

```ts
deleteBranch(path: string, name: string): Promise<void>
```

```ts
await git.deleteBranch('workspace/repo', 'new-feature');
```

#### pull()

Pulls changes from the remote repository.

```ts
pull(path: string, username?: string, password?: string): Promise<void>
```

```ts
await git.pull('workspace/repo');
await git.pull('workspace/repo', 'user', 'token'); // Private repo
```

#### push()

Pushes local changes to the remote repository.

```ts
push(path: string, username?: string, password?: string): Promise<void>
```

```ts
await git.push('workspace/repo');
await git.push('workspace/repo', 'user', 'token'); // Private repo
```

#### status()

Gets the current status of the Git repository.

```ts
status(path: string): Promise<GitStatus>
```

Returns object with:
- `currentBranch`: Name of the current branch
- `ahead`: Number of commits ahead of remote
- `behind`: Number of commits behind remote
- `branchPublished`: Whether branch is published to remote
- `fileStatus`: List of file statuses

```ts
const status = await git.status('workspace/repo');
console.log(`Current branch: ${status.currentBranch}`);
console.log(`Commits ahead: ${status.ahead}`);
console.log(`Commits behind: ${status.behind}`);
```