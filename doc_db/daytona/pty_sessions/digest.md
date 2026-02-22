## Pseudo Terminal (PTY) Sessions

PTY (Pseudo Terminal) is a virtual terminal interface enabling interactive terminal sessions in sandboxes. Use cases: REPLs, debuggers, build processes, system administration, terminal-based UIs.

### Create PTY Session

```python
from daytona.common.pty import PtySize
pty_handle = sandbox.process.create_pty_session(
    id="my-session",
    cwd="/workspace",
    envs={"TERM": "xterm-256color"},
    pty_size=PtySize(cols=120, rows=30)
)
```

```typescript
const ptyHandle = await sandbox.process.createPty({
  id: 'my-interactive-session',
  cwd: '/workspace',
  envs: { TERM: 'xterm-256color', LANG: 'en_US.UTF-8' },
  cols: 120,
  rows: 30,
  onData: (data) => {
    const text = new TextDecoder().decode(data)
    process.stdout.write(text)
  },
})
await ptyHandle.waitForConnection()
await ptyHandle.sendInput('ls -la\n')
const result = await ptyHandle.wait()
console.log(`Exit code: ${result.exitCode}`)
await ptyHandle.disconnect()
```

```ruby
pty_size = Daytona::PtySize.new(rows: 30, cols: 120)
pty_handle = sandbox.process.create_pty_session(
  id: 'my-interactive-session',
  cwd: '/workspace',
  envs: { 'TERM' => 'xterm-256color' },
  pty_size: pty_size
)
pty_handle.send_input("ls -la\n")
pty_handle.each { |data| print data }
puts "Exit code: #{pty_handle.exit_code}"
```

```go
handle, err := sandbox.Process.CreatePty(ctx, "my-interactive-session",
	options.WithCreatePtySize(types.PtySize{Cols: 120, Rows: 30}),
	options.WithCreatePtyEnv(map[string]string{"TERM": "xterm-256color"}),
)
if err != nil { log.Fatal(err) }
defer handle.Disconnect()
if err := handle.WaitForConnection(ctx); err != nil { log.Fatal(err) }
handle.SendInput([]byte("ls -la\n"))
for data := range handle.DataChan() { fmt.Print(string(data)) }
result, err := handle.Wait(ctx)
if err != nil { log.Fatal(err) }
fmt.Printf("Exit code: %d\n", *result.ExitCode)
```

```bash
curl 'https://proxy.app.daytona.io/toolbox/{sandboxId}/process/pty' \
  --request POST \
  --header 'Content-Type: application/json' \
  --data '{
  "cols": 120,
  "cwd": "/workspace",
  "envs": {"TERM": "xterm-256color"},
  "id": "my-session",
  "rows": 30
}'
```

### Connect to Existing PTY Session

```python
pty_handle = sandbox.process.connect_pty_session("my-session")
pty_handle.send_input("pwd\n")
pty_handle.send_input("exit\n")
for data in pty_handle:
    print(data.decode("utf-8", errors="replace"), end="")
print(f"Exit code: {pty_handle.exit_code}")
```

```typescript
const handle = await sandbox.process.connectPty('my-session', {
  onData: (data) => {
    const text = new TextDecoder().decode(data)
    process.stdout.write(text)
  },
})
await handle.waitForConnection()
await handle.sendInput('pwd\n')
const result = await handle.wait()
console.log(`Exit code: ${result.exitCode}`)
await handle.disconnect()
```

```ruby
pty_handle = sandbox.process.connect_pty_session('my-session')
pty_handle.send_input("echo 'Hello World'\n")
pty_handle.each { |data| print data }
puts "Exit code: #{pty_handle.exit_code}"
```

```go
handle, err := sandbox.Process.ConnectPty(ctx, "my-session")
if err != nil { log.Fatal(err) }
defer handle.Disconnect()
if err := handle.WaitForConnection(ctx); err != nil { log.Fatal(err) }
handle.SendInput([]byte("pwd\n"))
for data := range handle.DataChan() { fmt.Print(string(data)) }
result, err := handle.Wait(ctx)
if err != nil { log.Fatal(err) }
fmt.Printf("Exit code: %d\n", *result.ExitCode)
```

```bash
curl 'https://proxy.app.daytona.io/toolbox/{sandboxId}/process/pty/{sessionId}/connect'
```

### List PTY Sessions

```python
sessions = sandbox.process.list_pty_sessions()
for session in sessions:
    print(f"ID: {session.id}, Active: {session.active}, Created: {session.created_at}")
```

```typescript
const sessions = await sandbox.process.listPtySessions()
for (const session of sessions) {
  console.log(`ID: ${session.id}, Active: ${session.active}, Created: ${session.createdAt}`)
}
```

```ruby
sessions = sandbox.process.list_pty_sessions
sessions.each { |s| puts "ID: #{s.id}, Active: #{s.active}, Size: #{s.cols}x#{s.rows}" }
```

```go
sessions, err := sandbox.Process.ListPtySessions(ctx)
if err != nil { log.Fatal(err) }
for _, session := range sessions {
	fmt.Printf("ID: %s, Active: %t, Size: %dx%d\n", session.Id, session.Active, session.Cols, session.Rows)
}
```

```bash
curl 'https://proxy.app.daytona.io/toolbox/{sandboxId}/process/pty'
```

### Get PTY Session Info

```python
session_info = sandbox.process.get_pty_session_info("my-session")
print(f"ID: {session_info.id}, Active: {session_info.active}, CWD: {session_info.cwd}, Size: {session_info.cols}x{session_info.rows}")
```

```typescript
const session = await sandbox.process.getPtySessionInfo('my-session')
console.log(`ID: ${session.id}, Active: ${session.active}, CWD: ${session.cwd}, Size: ${session.cols}x${session.rows}`)
if (session.processId) console.log(`PID: ${session.processId}`)
```

```ruby
session_info = sandbox.process.get_pty_session_info('my-session')
puts "ID: #{session_info.id}, Active: #{session_info.active}, CWD: #{session_info.cwd}, Size: #{session_info.cols}x#{session_info.rows}"
```

```go
session, err := sandbox.Process.GetPtySessionInfo(ctx, "my-session")
if err != nil { log.Fatal(err) }
fmt.Printf("ID: %s, Active: %t, CWD: %s, Size: %dx%d\n", session.Id, session.Active, session.Cwd, session.Cols, session.Rows)
if session.ProcessId != nil { fmt.Printf("PID: %d\n", *session.ProcessId) }
```

```bash
curl 'https://proxy.app.daytona.io/toolbox/{sandboxId}/process/session/{sessionId}'
```

### Kill PTY Session

```python
sandbox.process.kill_pty_session("my-session")
pty_sessions = sandbox.process.list_pty_sessions()
for pty_session in pty_sessions:
    print(f"PTY session: {pty_session.id}")
```

```typescript
await sandbox.process.killPtySession('my-session')
try {
  const info = await sandbox.process.getPtySessionInfo('my-session')
  console.log(`Still exists, active: ${info.active}`)
} catch (error) {
  console.log('Session removed')
}
```

```ruby
sandbox.process.delete_pty_session('my-session')
sessions = sandbox.process.list_pty_sessions
sessions.each { |session| puts "PTY session: #{session.id}" }
```

```go
err := sandbox.Process.KillPtySession(ctx, "my-session")
if err != nil { log.Fatal(err) }
sessions, err := sandbox.Process.ListPtySessions(ctx)
if err != nil { log.Fatal(err) }
for _, session := range sessions {
	fmt.Printf("PTY session: %s\n", session.Id)
}
```

```bash
curl 'https://proxy.app.daytona.io/toolbox/{sandboxId}/process/session/{sessionId}' \
  --request DELETE
```

### Resize PTY Session

```python
from daytona.common.pty import PtySize
new_size = PtySize(rows=40, cols=150)
updated_info = sandbox.process.resize_pty_session("my-session", new_size)
print(f"Resized to {updated_info.cols}x{updated_info.rows}")
pty_handle.resize(new_size)
```

```typescript
const updatedInfo = await sandbox.process.resizePtySession('my-session', 150, 40)
console.log(`Resized to ${updatedInfo.cols}x${updatedInfo.rows}`)
await ptyHandle.resize(150, 40)
```

```ruby
pty_size = Daytona::PtySize.new(rows: 40, cols: 150)
session_info = sandbox.process.resize_pty_session('my-session', pty_size)
puts "Resized to #{session_info.cols}x#{session_info.rows}"
```

```go
updatedInfo, err := sandbox.Process.ResizePtySession(ctx, "my-session", types.PtySize{Cols: 150, Rows: 40})
if err != nil { log.Fatal(err) }
fmt.Printf("Resized to %dx%d\n", updatedInfo.Cols, updatedInfo.Rows)
info, err := handle.Resize(ctx, 150, 40)
if err != nil { log.Fatal(err) }
fmt.Printf("Resized to %dx%d\n", info.Cols, info.Rows)
```

```bash
curl 'https://proxy.app.daytona.io/toolbox/{sandboxId}/process/pty/{sessionId}/resize' \
  --request POST \
  --header 'Content-Type: application/json' \
  --data '{"cols": 150, "rows": 40}'
```

### Interactive Commands Example

```python
import time, threading
from daytona.common.pty import PtySize

def handle_pty_data(data: bytes):
    print(data.decode("utf-8", errors="replace"), end="")

pty_handle = sandbox.process.create_pty_session(
    id="interactive-session",
    pty_size=PtySize(cols=300, rows=100)
)

pty_handle.send_input('printf "Accept? (y/n): " && read confirm && if [ "$confirm" = "y" ]; then echo "Accepted"; else echo "Rejected"; fi\n')
time.sleep(1)
pty_handle.send_input("y\n")

pty_session_info = pty_handle.resize(PtySize(cols=210, rows=110))
print(f"Resized to {pty_session_info.cols}x{pty_session_info.rows}")

pty_handle.send_input('exit\n')
for data in pty_handle:
    handle_pty_data(data)
print(f"Exit code: {pty_handle.exit_code}")
```

```typescript
const ptyHandle = await sandbox.process.createPty({
  id: 'interactive-session',
  cols: 300,
  rows: 100,
  onData: data => {
    const text = new TextDecoder().decode(data)
    process.stdout.write(text)
  },
})
await ptyHandle.waitForConnection()

await ptyHandle.sendInput('printf "Accept? (y/n): " && read confirm && if [ "$confirm" = "y" ]; then echo "Accepted"; else echo "Rejected"; fi\n')
await new Promise(resolve => setTimeout(resolve, 1000))
await ptyHandle.sendInput('y\n')

const ptySessionInfo = await sandbox.process.resizePtySession('interactive-session', 210, 110)
console.log(`Resized to ${ptySessionInfo.cols}x${ptySessionInfo.rows}`)

await ptyHandle.sendInput('exit\n')
const result = await ptyHandle.wait()
console.log(`Exit code: ${result.exitCode}`)
```

```ruby
pty_handle = sandbox.process.create_pty_session(
  id: 'interactive-session',
  pty_size: Daytona::PtySize.new(cols: 300, rows: 100)
)

thread = Thread.new { pty_handle.each { |data| print data } }

pty_handle.send_input('printf "Accept? (y/n): " && read confirm && if [ "$confirm" = "y" ]; then echo "Accepted"; else echo "Rejected"; fi' + "\n")
sleep(1)
pty_handle.send_input("y\n")

pty_handle.resize(Daytona::PtySize.new(cols: 210, rows: 110))
puts "\nResized"

pty_handle.send_input("exit\n")
thread.join
puts "Exit code: #{pty_handle.exit_code}"
```

```go
handle, err := sandbox.Process.CreatePty(ctx, "interactive-session",
	options.WithCreatePtySize(types.PtySize{Cols: 300, Rows: 100}),
)
if err != nil { log.Fatal(err) }
defer handle.Disconnect()
if err := handle.WaitForConnection(ctx); err != nil { log.Fatal(err) }

go func() {
	for data := range handle.DataChan() {
		fmt.Print(string(data))
	}
}()

handle.SendInput([]byte(`printf "Accept? (y/n): " && read confirm && if [ "$confirm" = "y" ]; then echo "Accepted"; else echo "Rejected"; fi` + "\n"))
time.Sleep(1 * time.Second)
handle.SendInput([]byte("y\n"))

info, err := handle.Resize(ctx, 210, 110)
if err != nil { log.Fatal(err) }
fmt.Printf("\nResized to %dx%d\n", info.Cols, info.Rows)

handle.SendInput([]byte("exit\n"))
result, err := handle.Wait(ctx)
if err != nil { log.Fatal(err) }
fmt.Printf("Exit code: %d\n", *result.ExitCode)
```

### Long-Running Processes Example

```python
import time, threading
from daytona.common.pty import PtySize

pty_handle = sandbox.process.create_pty_session(
    id="long-running-session",
    pty_size=PtySize(cols=120, rows=30)
)

pty_handle.send_input('while true; do echo "Running... $(date)"; sleep 1; done\n')
time.sleep(3)

print("Killing process...")
pty_handle.kill()

for data in pty_handle:
    print(data.decode("utf-8", errors="replace"), end="")

print(f"Exit code: {pty_handle.exit_code}")
if pty_handle.error:
    print(f"Error: {pty_handle.error}")
```

```typescript
const ptyHandle = await sandbox.process.createPty({
  id: 'long-running-session',
  cols: 120,
  rows: 30,
  onData: (data) => {
    const text = new TextDecoder().decode(data)
    process.stdout.write(text)
  },
})
await ptyHandle.waitForConnection()

await ptyHandle.sendInput('while true; do echo "Running... $(date)"; sleep 1; done\n')
await new Promise(resolve => setTimeout(resolve, 3000))

console.log('Killing process...')
await ptyHandle.kill()

const result = await ptyHandle.wait()
console.log(`Exit code: ${result.exitCode}`)
if (result.error) console.log(`Error: ${result.error}`)
```

```ruby
pty_handle = sandbox.process.create_pty_session(
  id: 'long-running-session',
  pty_size: Daytona::PtySize.new(cols: 120, rows: 30)
)

thread = Thread.new { pty_handle.each { |data| print data } }

pty_handle.send_input("while true; do echo \"Running... $(date)\"; sleep 1; done\n")
sleep(3)

puts "Killing process..."
pty_handle.kill

thread.join
puts "Exit code: #{pty_handle.exit_code}"
puts "Error: #{pty_handle.error}" if pty_handle.error
```

```go
handle, err := sandbox.Process.CreatePty(ctx, "long-running-session",
	options.WithCreatePtySize(types.PtySize{Cols: 120, Rows: 30}),
)
if err != nil { log.Fatal(err) }
defer handle.Disconnect()
if err := handle.WaitForConnection(ctx); err != nil { log.Fatal(err) }

go func() {
	for data := range handle.DataChan() {
		fmt.Print(string(data))
	}
}()

handle.SendInput([]byte(`while true; do echo "Running... $(date)"; sleep 1; done` + "\n"))
time.Sleep(3 * time.Second)

fmt.Println("Killing process...")
if err := handle.Kill(ctx); err != nil { log.Fatal(err) }

result, err := handle.Wait(ctx)
if err != nil { log.Fatal(err) }
fmt.Printf("Exit code: %d\n", *result.ExitCode)
if result.Error != nil { fmt.Printf("Error: %s\n", *result.Error) }
```

### Resource Management

Always clean up PTY sessions to prevent resource leaks:

```python
pty_handle = None
try:
    pty_handle = sandbox.process.create_pty_session(id="session", pty_size=PtySize(cols=120, rows=30))
    # Do work...
finally:
    if pty_handle:
        pty_handle.kill()
```

```typescript
let ptyHandle
try {
  ptyHandle = await sandbox.process.createPty({id: 'session', cols: 120, rows: 30})
  // Do work...
} finally {
  if (ptyHandle) await ptyHandle.kill()
}
```

```ruby
pty_handle = nil
begin
  pty_handle = sandbox.process.create_pty_session(
    id: 'session',
    pty_size: Daytona::PtySize.new(cols: 120, rows: 30)
  )
  # Do work...
ensure
  pty_handle&.kill
end
```

```go
handle, err := sandbox.Process.CreatePty(ctx, "session",
	options.WithCreatePtySize(types.PtySize{Cols: 120, Rows: 30}),
)
if err != nil { log.Fatal(err) }
defer handle.Disconnect()
// Do work...
defer handle.Kill(ctx)
```

### PtyHandle Methods

**Send input**: Send commands or user input to the PTY session.

```python
pty_handle.send_input("ls -la\n")
pty_handle.send_input("y\n")
```

```typescript
await ptyHandle.sendInput('ls -la\n')
await ptyHandle.sendInput(new Uint8Array([3])) // Ctrl+C
```

```ruby
pty_handle.send_input("ls -la\n")
```

```go
handle.SendInput([]byte("ls -la\n"))
handle.SendInput([]byte{0x03}) // Ctrl+C
```

**Wait for completion**: Wait for PTY process to exit and get result.

```python
def handle_data(data: bytes):
    print(data.decode("utf-8", errors="replace"), end="")
result = pty_handle.wait(on_data=handle_data, timeout=30)
print(f"Exit code: {result.exit_code}")
```

```typescript
const result = await ptyHandle.wait()
if (result.exitCode === 0) {
  console.log('Success')
} else {
  console.log(`Failed: ${result.exitCode}`)
  if (result.error) console.log(`Error: ${result.error}`)
}
```

```ruby
pty_handle.each { |data| print data }
if pty_handle.exit_code == 0
  puts 'Success'
else
  puts "Failed: #{pty_handle.exit_code}"
  puts "Error: #{pty_handle.error}" if pty_handle.error
end
```

```go
result, err := handle.Wait(ctx)
if err != nil { log.Fatal(err) }
if result.ExitCode != nil && *result.ExitCode == 0 {
	fmt.Println("Success")
} else {
	fmt.Printf("Failed: %d\n", *result.ExitCode)
	if result.Error != nil { fmt.Printf("Error: %s\n", *result.Error) }
}
```

**Wait for connection**: Wait for WebSocket connection to be established before sending input.

```python
# Python handles connection internally
```

```typescript
await ptyHandle.waitForConnection()
await ptyHandle.sendInput('echo "Connected!"\n')
```

```ruby
# Ruby handles connection internally
pty_handle.send_input("echo 'Connected!'\n")
```

```go
if err := handle.WaitForConnection(ctx); err != nil { log.Fatal(err) }
handle.SendInput([]byte("echo 'Connected!'\n"))
```

**Kill PTY process**: Terminate the session from the handle.

```python
pty_handle.kill()
```

```typescript
await ptyHandle.kill()
const result = await ptyHandle.wait()
console.log(`Exit code: ${result.exitCode}`)
```

```ruby
pty_handle.kill
puts "Exit code: #{pty_handle.exit_code}"
```

```go
if err := handle.Kill(ctx); err != nil { log.Fatal(err) }
result, err := handle.Wait(ctx)
if err != nil { log.Fatal(err) }
fmt.Printf("Exit code: %d\n", *result.ExitCode)
```

**Resize from handle**: Change terminal dimensions directly from the handle.

```python
from daytona.common.pty import PtySize
pty_handle.resize(PtySize(cols=120, rows=30))
```

```typescript
await ptyHandle.resize(120, 30)
```

```ruby
pty_handle.resize(Daytona::PtySize.new(cols: 120, rows: 30))
```

```go
info, err := handle.Resize(ctx, 120, 30)
if err != nil { log.Fatal(err) }
fmt.Printf("Resized to %dx%d\n", info.Cols, info.Rows)
```

**Disconnect**: Disconnect from PTY session and clean up resources without killing the process.

```python
# Use kill() to terminate or let handle go out of scope
```

```typescript
try {
  // ... use PTY session
} finally {
  await ptyHandle.disconnect()
}
```

```ruby
begin
  # ... use PTY session
ensure
  pty_handle.kill
end
```

```go
handle, err := sandbox.Process.CreatePty(ctx, "session")
if err != nil { log.Fatal(err) }
defer handle.Disconnect()
// ... use PTY session
```

**Check connection status**: Check if PTY session is still connected.

```python
session_info = sandbox.process.get_pty_session_info("my-session")
print(f"Active: {session_info.active}")
```

```typescript
if (ptyHandle.isConnected()) {
  console.log('PTY session is active')
}
```

```ruby
session_info = sandbox.process.get_pty_session_info('my-session')
puts 'Active' if session_info.active
```

```go
if handle.IsConnected() {
	fmt.Println("PTY session is active")
}
```

**Exit code and error**: Access exit code and error message after process terminates.

```python
print(f"Exit code: {pty_handle.exit_code}")
if pty_handle.error:
    print(f"Error: {pty_handle.error}")
```

```typescript
console.log(`Exit code: ${ptyHandle.exitCode}`)
if (ptyHandle.error) console.log(`Error: ${ptyHandle.error}`)
```

```ruby
puts "Exit code: #{pty_handle.exit_code}"
puts "Error: #{pty_handle.error}" if pty_handle.error
```

```go
if exitCode := handle.ExitCode(); exitCode != nil {
	fmt.Printf("Exit code: %d\n", *exitCode)
}
if errMsg := handle.Error(); errMsg != nil {
	fmt.Printf("Error: %s\n", *errMsg)
}
```

**Iterate over output (Python/Ruby)**: Iterate over PTY handle to receive output data.

```python
for data in pty_handle:
    text = data.decode("utf-8", errors="replace")
    print(text, end="")
print(f"Exit code: {pty_handle.exit_code}")
```

```ruby
pty_handle.each do |data|
  print data
end
puts "Exit code: #{pty_handle.exit_code}"
```

TypeScript uses `onData` callback, Go uses `DataChan()` channel.

### Error Handling

Check exit codes and handle errors appropriately:

```python
result = pty_handle.wait()
if result.exit_code != 0:
    print(f"Failed: {result.exit_code}")
    print(f"Error: {result.error}")
```

```typescript
const result = await ptyHandle.wait()
if (result.exitCode !== 0) {
  console.log(`Failed: ${result.exitCode}`)
  console.log(`Error: ${result.error}`)
}
```

```ruby
pty_handle.each { |data| print data }
if pty_handle.exit_code != 0
  puts "Failed: #{pty_handle.exit_code}"
  puts "Error: #{pty_handle.error}"
end
```

```go
result, err := handle.Wait(ctx)
if err != nil { log.Fatal(err) }
if result.ExitCode != nil && *result.ExitCode != 0 {
	fmt.Printf("Failed: %d\n", *result.ExitCode)
	if result.Error != nil { fmt.Printf("Error: %s\n", *result.Error) }
}
```

### Troubleshooting

- **Connection issues**: Verify sandbox status, network connectivity, and proper session IDs
- **Performance issues**: Use appropriate terminal dimensions and efficient data handlers
- **Process management**: Use explicit `kill()` calls and proper timeout handling for long-running processes
