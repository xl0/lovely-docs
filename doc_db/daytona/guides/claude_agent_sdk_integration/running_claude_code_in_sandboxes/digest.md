## Running Claude Code in a Daytona Sandbox

Execute Claude Code tasks inside isolated Daytona sandboxes with real-time log streaming.

### Python (AsyncDaytona recommended)

```python
import os
import asyncio
from daytona import AsyncDaytona

async def run_claude_code():
    async with AsyncDaytona() as daytona:
        sandbox = await daytona.create()
        
        # Install Claude Code
        await sandbox.process.exec("npm install -g @anthropic-ai/claude-code")
        
        # Create PTY session with streaming output
        pty_handle = await sandbox.process.create_pty_session(
            id="claude", on_data=lambda data: print(data.decode(), end="")
        )
        await pty_handle.wait_for_connection()
        
        # Run Claude Code command with API key
        claude_command = "claude --dangerously-skip-permissions -p 'write a dad joke about penguins' --output-format stream-json --verbose"
        await pty_handle.send_input(
            f"ANTHROPIC_API_KEY={os.environ['ANTHROPIC_API_KEY']} {claude_command}\n"
        )
        
        await pty_handle.wait()
        # await sandbox.delete()  # Clean up when done

asyncio.run(run_claude_code())
```

**Note:** AsyncDaytona is recommended for streaming PTY output via automatic `on_data` callbacks. Sync mode requires blocking iteration or manual threading.

### TypeScript

```typescript
import { Daytona } from "@daytonaio/sdk";

const daytona = new Daytona();
const sandbox = await daytona.create();

await sandbox.process.executeCommand("npm install -g @anthropic-ai/claude-code");

const ptyHandle = await sandbox.process.createPty({
    id: "claude",
    onData: (data) => process.stdout.write(data),
});

await ptyHandle.waitForConnection();

const claudeCommand = "claude --dangerously-skip-permissions -p 'write a dad joke about penguins' --output-format stream-json --verbose";
ptyHandle.sendInput(
    `ANTHROPIC_API_KEY=${process.env.ANTHROPIC_API_KEY} ${claudeCommand}\n`
);

await ptyHandle.wait();
// await sandbox.delete();
```

### Key Concepts

- **PTY Sessions:** Create pseudo-terminal sessions for interactive command execution with real-time output streaming
- **on_data Callback:** Automatically receives and processes output as it streams
- **API Key Injection:** Pass ANTHROPIC_API_KEY via environment variable in command
- **Cleanup:** Call `sandbox.delete()` to free resources after completion
