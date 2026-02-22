## Running Claude Code in Sandboxes

Execute Claude Code tasks with real-time log streaming using PTY sessions.

```python
import asyncio
from daytona import AsyncDaytona

async def run_claude_code():
    async with AsyncDaytona() as daytona:
        sandbox = await daytona.create()
        await sandbox.process.exec("npm install -g @anthropic-ai/claude-code")
        
        pty_handle = await sandbox.process.create_pty_session(
            id="claude", on_data=lambda data: print(data.decode(), end="")
        )
        await pty_handle.wait_for_connection()
        
        await pty_handle.send_input(
            f"ANTHROPIC_API_KEY={os.environ['ANTHROPIC_API_KEY']} claude --dangerously-skip-permissions -p 'write a dad joke about penguins' --output-format stream-json --verbose\n"
        )
        await pty_handle.wait()

asyncio.run(run_claude_code())
```

**AsyncDaytona recommended** for automatic streaming callbacks via `on_data`. TypeScript equivalent uses `createPty()` with `onData` callback.
