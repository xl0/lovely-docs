## Git

Provides Git operations within a Sandbox.

### Key Methods

**add()** - Stage files for commit
```ts
await git.add('workspace/repo', ['file.txt']);
await git.add('workspace/repo', ['.']); // Stage all
```

**clone()** - Clone repository with optional branch/commit and authentication
```ts
await git.clone('https://github.com/user/repo.git', 'workspace/repo');
await git.clone(url, path, 'branch-name', undefined, 'user', 'token');
await git.clone(url, path, undefined, 'commit-sha'); // Detached HEAD
```

**commit()** - Commit staged changes
```ts
await git.commit(path, 'message', 'Author Name', 'email@example.com', allowEmpty);
```

**branches()** - List branches
```ts
const response = await git.branches('workspace/repo');
```

**checkoutBranch()** - Checkout branch
```ts
await git.checkoutBranch('workspace/repo', 'branch-name');
```

**createBranch() / deleteBranch()** - Create or delete branch
```ts
await git.createBranch('workspace/repo', 'new-feature');
await git.deleteBranch('workspace/repo', 'old-feature');
```

**pull() / push()** - Sync with remote
```ts
await git.pull('workspace/repo', 'user', 'token');
await git.push('workspace/repo', 'user', 'token');
```

**status()** - Get repository status
```ts
const status = await git.status('workspace/repo');
// Returns: currentBranch, ahead, behind, branchPublished, fileStatus
```