## Log Streaming

Access and process logs in real-time while processes are running in sandboxes. Useful for debugging, monitoring, and observability tool integration.

### Stream logs with callbacks

Process logs asynchronously in the background while execution continues. Ideal for continuous monitoring, debugging long-running jobs, and live log forwarding.

Starting with version 0.27.0, session command logs are available in two separate streams: stdout and stderr.

**Python:**
```python
import asyncio
from daytona import Daytona, SessionExecuteRequest

async def main():
  daytona = Daytona()
  sandbox = daytona.create()
  session_id = "streaming-session"
  sandbox.process.create_session(session_id)

  command = sandbox.process.execute_session_command(
    session_id,
    SessionExecuteRequest(
      command='for i in {1..5}; do echo "Step $i"; echo "Error $i" >&2; sleep 1; done',
      var_async=True,
    ),
  )

  logs_task = asyncio.create_task(
    sandbox.process.get_session_command_logs_async(
      session_id,
      command.cmd_id,
      lambda stdout: print(f"[STDOUT]: {stdout}"),
      lambda stderr: print(f"[STDERR]: {stderr}"),
    )
  )

  print("Continuing execution while logs are streaming...")
  await asyncio.sleep(3)
  await logs_task
  sandbox.delete()

asyncio.run(main())
```

**TypeScript:**
```typescript
import { Daytona, SessionExecuteRequest } from '@daytonaio/sdk'

async function main() {
  const daytona = new Daytona()
  const sandbox = await daytona.create()
  const sessionId = "exec-session-1"
  await sandbox.process.createSession(sessionId)

  const command = await sandbox.process.executeSessionCommand(
    sessionId,
    {
      command: 'for i in {1..5}; do echo "Step $i"; echo "Error $i" >&2; sleep 1; done',
      runAsync: true,
    },
  )

  const logsTask = sandbox.process.getSessionCommandLogs(
    sessionId,
    command.cmdId!,
    (stdout) => console.log('[STDOUT]:', stdout),
    (stderr) => console.log('[STDERR]:', stderr),
  )

  console.log('Continuing execution while logs are streaming...')
  await new Promise((resolve) => setTimeout(resolve, 3000))
  await logsTask
  await sandbox.delete()
}

main()
```

**Ruby:**
```ruby
require 'daytona'

daytona = Daytona::Daytona.new
sandbox = daytona.create
session_id = 'streaming-session'
sandbox.process.create_session(session_id)

command = sandbox.process.execute_session_command(
  session_id,
  Daytona::SessionExecuteRequest.new(
    command: 'for i in {1..5}; do echo "Step $i"; echo "Error $i" >&2; sleep 1; done',
    var_async: true
  )
)

log_thread = Thread.new do
  sandbox.process.get_session_command_logs_stream(
    session_id,
    command.cmd_id,
    on_stdout: ->(stdout) { puts "[STDOUT]: #{stdout}" },
    on_stderr: ->(stderr) { puts "[STDERR]: #{stderr}" }
  )
end

puts 'Continuing execution while logs are streaming...'
sleep(3)
log_thread.join
daytona.delete(sandbox)
```

**Go:**
```go
package main

import (
	"context"
	"fmt"
	"github.com/daytonaio/daytona/libs/sdk-go/pkg/daytona"
)

func main() {
	client, _ := daytona.NewClient()
	ctx := context.Background()
	sandbox, _ := client.Create(ctx, nil)

	sessionID := "streaming-session"
	sandbox.Process.CreateSession(ctx, sessionID)

	cmd := `for i in 1 2 3 4 5; do echo "Step $i"; echo "Error $i" >&2; sleep 1; done`
	cmdResult, _ := sandbox.Process.ExecuteSessionCommand(ctx, sessionID, cmd, true)
	cmdID, _ := cmdResult["id"].(string)

	stdout := make(chan string, 100)
	stderr := make(chan string, 100)

	go func() {
		sandbox.Process.GetSessionCommandLogsStream(ctx, sessionID, cmdID, stdout, stderr)
	}()

	fmt.Println("Continuing execution while logs are streaming...")
	stdoutOpen, stderrOpen := true, true
	for stdoutOpen || stderrOpen {
		select {
		case chunk, ok := <-stdout:
			if !ok {
				stdoutOpen = false
			} else {
				fmt.Printf("[STDOUT]: %s", chunk)
			}
		case chunk, ok := <-stderr:
			if !ok {
				stderrOpen = false
			} else {
				fmt.Printf("[STDERR]: %s", chunk)
			}
		}
	}

	sandbox.Delete(ctx)
}
```

**API:**
```bash
curl 'https://proxy.app.daytona.io/toolbox/{sandboxId}/process/session/{sessionId}/command/{commandId}/logs'
```

### Retrieve all existing logs

Get logs up to the current point in time for commands with predictable duration or periodic log checking.

**Python:**
```python
import time
from daytona import Daytona, SessionExecuteRequest

daytona = Daytona()
sandbox = daytona.create()
session_id = "exec-session-1"
sandbox.process.create_session(session_id)

# Blocking command
command = sandbox.process.execute_session_command(
  session_id, SessionExecuteRequest(command="echo 'Hello from stdout' && echo 'Hello from stderr' >&2")
)
print(f"[STDOUT]: {command.stdout}")
print(f"[STDERR]: {command.stderr}")

# Async command with later log retrieval
command = sandbox.process.execute_session_command(
  session_id, 
  SessionExecuteRequest(
    command='while true; do if (( RANDOM % 2 )); then echo "All good at $(date)"; else echo "Oops, an error at $(date)" >&2; fi; sleep 1; done',
    run_async=True
  )
)
time.sleep(5)
logs = sandbox.process.get_session_command_logs(session_id, command.cmd_id)
print(f"[STDOUT]: {logs.stdout}")
print(f"[STDERR]: {logs.stderr}")

sandbox.delete()
```

**TypeScript:**
```typescript
import { Daytona, SessionExecuteRequest } from '@daytonaio/sdk'

async function main() {
  const daytona = new Daytona()
  const sandbox = await daytona.create()
  const sessionId = "exec-session-1"
  await sandbox.process.createSession(sessionId)

  const command = await sandbox.process.executeSessionCommand(
    sessionId,
    { command: 'echo "Hello from stdout" && echo "Hello from stderr" >&2' },
  )
  console.log(`[STDOUT]: ${command.stdout}`)
  console.log(`[STDERR]: ${command.stderr}`)

  const command2 = await sandbox.process.executeSessionCommand(
    sessionId,
    {
      command: 'while true; do if (( RANDOM % 2 )); then echo "All good at $(date)"; else echo "Oops, an error at $(date)" >&2; fi; sleep 1; done',
      runAsync: true,
    },
  )
  await new Promise((resolve) => setTimeout(resolve, 5000))
  const logs = await sandbox.process.getSessionCommandLogs(sessionId, command2.cmdId!)
  console.log(`[STDOUT]: ${logs.stdout}`)
  console.log(`[STDERR]: ${logs.stderr}`)

  await sandbox.delete()
}

main()
```

**Ruby:**
```ruby
require 'daytona'

daytona = Daytona::Daytona.new
sandbox = daytona.create
session_id = 'exec-session-1'
sandbox.process.create_session(session_id)

command = sandbox.process.execute_session_command(
  session_id,
  Daytona::SessionExecuteRequest.new(
    command: 'echo "Hello from stdout" && echo "Hello from stderr" >&2'
  )
)
puts "[STDOUT]: #{command.stdout}"
puts "[STDERR]: #{command.stderr}"

command = sandbox.process.execute_session_command(
  session_id,
  Daytona::SessionExecuteRequest.new(
    command: 'while true; do if (( RANDOM % 2 )); then echo "All good at $(date)"; else echo "Oops, an error at $(date)" >&2; fi; sleep 1; done',
    var_async: true
  )
)
sleep(5)
logs = sandbox.process.get_session_command_logs(session_id, command.cmd_id)
puts "[STDOUT]: #{logs.stdout}"
puts "[STDERR]: #{logs.stderr}"

daytona.delete(sandbox)
```

**Go:**
```go
package main

import (
	"context"
	"fmt"
	"time"
	"github.com/daytonaio/daytona/libs/sdk-go/pkg/daytona"
)

func main() {
	client, _ := daytona.NewClient()
	ctx := context.Background()
	sandbox, _ := client.Create(ctx, nil)

	sessionID := "exec-session-1"
	sandbox.Process.CreateSession(ctx, sessionID)

	cmd1, _ := sandbox.Process.ExecuteSessionCommand(ctx, sessionID,
		`echo "Hello from stdout" && echo "Hello from stderr" >&2`, false)
	if stdout, ok := cmd1["stdout"].(string); ok {
		fmt.Printf("[STDOUT]: %s\n", stdout)
	}

	cmd := `counter=1; while (( counter <= 5 )); do echo "Count: $counter"; ((counter++)); sleep 1; done`
	cmdResult, _ := sandbox.Process.ExecuteSessionCommand(ctx, sessionID, cmd, true)
	cmdID, _ := cmdResult["id"].(string)

	time.Sleep(5 * time.Second)

	logs, _ := sandbox.Process.GetSessionCommandLogs(ctx, sessionID, cmdID)
	if logContent, ok := logs["logs"].(string); ok {
		fmt.Printf("[LOGS]: %s\n", logContent)
	}

	sandbox.Delete(ctx)
}
```

**API:**
```bash
curl 'https://proxy.app.daytona.io/toolbox/{sandboxId}/process/session/{sessionId}/command/{commandId}/logs'
```