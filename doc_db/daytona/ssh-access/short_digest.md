## SSH Access Tokens

Create time-limited tokens for sandbox SSH access:

```python
sandbox.create_ssh_access(expires_in_minutes=60)
```

Connect with `ssh <token>@ssh.app.daytona.io`. Integrate with VSCode (Remote Explorer) or JetBrains Gateway. Tokens expire after 60 minutes; revoke with `sandbox.revoke_ssh_access()` or `sandbox.revoke_ssh_access(token="...")`.
