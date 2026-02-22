## Creating SSH Access Tokens

Generate time-limited SSH tokens for sandbox access via dashboard or SDK:

```python
from daytona import Daytona

daytona = Daytona()
sandbox = daytona.get("sandbox-abc123")
ssh_access = sandbox.create_ssh_access(expires_in_minutes=60)
print(f"SSH Token: {ssh_access.token}")
```

```typescript
const daytona = new Daytona()
const sandbox = await daytona.get('sandbox-abc123')
const sshAccess = await sandbox.createSshAccess(60)
```

```ruby
daytona = Daytona::Daytona.new
sandbox = daytona.get('sandbox-abc123')
ssh_access = sandbox.create_ssh_access(expires_in_minutes: 60)
```

## Connection

Connect using the generated token:

```bash
ssh <token>@ssh.app.daytona.io
```

## IDE Integration

**VSCode**: Install Remote Explorer extension, add SSH connection with the command above.

**JetBrains IDEs**: Download JetBrains Gateway, add connection with SSH command, select IDE for sandbox installation.

## Token Management

Tokens expire after 60 minutes by default. Revoke all or specific tokens:

```python
sandbox.revoke_ssh_access()
sandbox.revoke_ssh_access(token="specific-token")
```

```typescript
await sandbox.revokeSshAccess()
await sandbox.revokeSshAccess('specific-token')
```

```ruby
sandbox.revoke_ssh_access
sandbox.revoke_ssh_access(token: 'specific-token')
```