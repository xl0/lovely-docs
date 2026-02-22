## PTY Sessions

Virtual terminal interface for interactive terminal sessions in sandboxes.

### Create, Connect, List, Get Info, Kill, Resize

```python
from daytona.common.pty import PtySize

# Create
pty_handle = sandbox.process.create_pty_session(
    id="my-session", cwd="/workspace",
    envs={"TERM": "xterm-256color"},
    pty_size=PtySize(cols=120, rows=30)
)

# Connect to existing
pty_handle = sandbox.process.connect_pty_session("my-session")

# List all
sessions = sandbox.process.list_pty_sessions()

# Get info
info = sandbox.process.get_pty_session_info("my-session")

# Kill
sandbox.process.kill_pty_session("my-session")

# Resize
sandbox.process.resize_pty_session("my-session", PtySize(cols=150, rows=40))
```

```typescript
// Create
const ptyHandle = await sandbox.process.createPty({
  id: 'my-session', cwd: '/workspace',
  envs: { TERM: 'xterm-256color' },
  cols: 120, rows: 30,
  onData: (data) => process.stdout.write(new TextDecoder().decode(data)),
})
await ptyHandle.waitForConnection()

// Connect
const handle = await sandbox.process.connectPty('my-session', {onData: ...})
await handle.waitForConnection()

// List
const sessions = await sandbox.process.listPtySessions()

// Get info
const info = await sandbox.process.getPtySessionInfo('my-session')

// Kill
await sandbox.process.killPtySession('my-session')

// Resize
await sandbox.process.resizePtySession('my-session', 150, 40)
```

```ruby
# Create
pty_handle = sandbox.process.create_pty_session(
  id: 'my-session', cwd: '/workspace',
  envs: { 'TERM' => 'xterm-256color' },
  pty_size: Daytona::PtySize.new(cols: 120, rows: 30)
)

# Connect
pty_handle = sandbox.process.connect_pty_session('my-session')

# List
sessions = sandbox.process.list_pty_sessions

# Get info
info = sandbox.process.get_pty_session_info('my-session')

# Kill
sandbox.process.delete_pty_session('my-session')

# Resize
sandbox.process.resize_pty_session('my-session', Daytona::PtySize.new(cols: 150, rows: 40))
```

```go
// Create
handle, err := sandbox.Process.CreatePty(ctx, "my-session",
	options.WithCreatePtySize(types.PtySize{Cols: 120, Rows: 30}),
	options.WithCreatePtyEnv(map[string]string{"TERM": "xterm-256color"}),
)
if err != nil { log.Fatal(err) }
defer handle.Disconnect()
if err := handle.WaitForConnection(ctx); err != nil { log.Fatal(err) }

// Connect
handle, err := sandbox.Process.ConnectPty(ctx, "my-session")

// List
sessions, err := sandbox.Process.ListPtySessions(ctx)

// Get info
session, err := sandbox.Process.GetPtySessionInfo(ctx, "my-session")

// Kill
err := sandbox.Process.KillPtySession(ctx, "my-session")

// Resize
info, err := handle.Resize(ctx, 150, 40)
```

### Send Input, Wait, Kill, Resize from Handle

```python
pty_handle.send_input("ls -la\n")
pty_handle.send_input("y\n")

# Wait with callback
result = pty_handle.wait(on_data=lambda data: print(data.decode(), end=""), timeout=30)
print(f"Exit code: {result.exit_code}")

# Or iterate
for data in pty_handle:
    print(data.decode(), end="")

pty_handle.kill()
pty_handle.resize(PtySize(cols=150, rows=40))
```

```typescript
await ptyHandle.sendInput('ls -la\n')
await ptyHandle.sendInput(new Uint8Array([3])) // Ctrl+C

const result = await ptyHandle.wait()
console.log(`Exit code: ${result.exitCode}`)

await ptyHandle.kill()
await ptyHandle.resize(150, 40)
await ptyHandle.disconnect()
```

```ruby
pty_handle.send_input("ls -la\n")

pty_handle.each { |data| print data }
puts "Exit code: #{pty_handle.exit_code}"

pty_handle.kill
pty_handle.resize(Daytona::PtySize.new(cols: 150, rows: 40))
```

```go
handle.SendInput([]byte("ls -la\n"))

for data := range handle.DataChan() { fmt.Print(string(data)) }

result, err := handle.Wait(ctx)
fmt.Printf("Exit code: %d\n", *result.ExitCode)

handle.Kill(ctx)
handle.Resize(ctx, 150, 40)
handle.Disconnect()
```

### Interactive Commands & Long-Running Processes

```python
import time
pty_handle = sandbox.process.create_pty_session(id="session", pty_size=PtySize(cols=300, rows=100))
pty_handle.send_input('printf "Accept? (y/n): " && read confirm && echo $confirm\n')
time.sleep(1)
pty_handle.send_input("y\n")
pty_handle.resize(PtySize(cols=210, rows=110))
pty_handle.send_input('exit\n')
for data in pty_handle: print(data.decode(), end="")
print(f"Exit code: {pty_handle.exit_code}")
```

```typescript
const ptyHandle = await sandbox.process.createPty({id: 'session', cols: 300, rows: 100, onData: ...})
await ptyHandle.waitForConnection()
await ptyHandle.sendInput('printf "Accept? (y/n): " && read confirm && echo $confirm\n')
await new Promise(r => setTimeout(r, 1000))
await ptyHandle.sendInput('y\n')
await ptyHandle.resize(210, 110)
await ptyHandle.sendInput('exit\n')
const result = await ptyHandle.wait()
console.log(`Exit code: ${result.exitCode}`)
```

```ruby
pty_handle = sandbox.process.create_pty_session(id: 'session', pty_size: Daytona::PtySize.new(cols: 300, rows: 100))
thread = Thread.new { pty_handle.each { |data| print data } }
pty_handle.send_input('printf "Accept? (y/n): " && read confirm && echo $confirm' + "\n")
sleep(1)
pty_handle.send_input("y\n")
pty_handle.resize(Daytona::PtySize.new(cols: 210, rows: 110))
pty_handle.send_input("exit\n")
thread.join
puts "Exit code: #{pty_handle.exit_code}"
```

```go
handle, err := sandbox.Process.CreatePty(ctx, "session", options.WithCreatePtySize(types.PtySize{Cols: 300, Rows: 100}))
if err != nil { log.Fatal(err) }
defer handle.Disconnect()
if err := handle.WaitForConnection(ctx); err != nil { log.Fatal(err) }
go func() { for data := range handle.DataChan() { fmt.Print(string(data)) } }()
handle.SendInput([]byte(`printf "Accept? (y/n): " && read confirm && echo $confirm` + "\n"))
time.Sleep(1 * time.Second)
handle.SendInput([]byte("y\n"))
handle.Resize(ctx, 210, 110)
handle.SendInput([]byte("exit\n"))
result, err := handle.Wait(ctx)
if err != nil { log.Fatal(err) }
fmt.Printf("Exit code: %d\n", *result.ExitCode)
```

Long-running: Same as above but with `while true; do echo "Running..."; sleep 1; done` and call `handle.Kill()` after a delay.

### Resource Management

Always clean up to prevent leaks:

```python
try:
    pty_handle = sandbox.process.create_pty_session(...)
    # work
finally:
    if pty_handle: pty_handle.kill()
```

```typescript
try {
  ptyHandle = await sandbox.process.createPty(...)
  // work
} finally {
  if (ptyHandle) await ptyHandle.kill()
}
```

```ruby
begin
  pty_handle = sandbox.process.create_pty_session(...)
  # work
ensure
  pty_handle&.kill
end
```

```go
handle, err := sandbox.Process.CreatePty(...)
if err != nil { log.Fatal(err) }
defer handle.Disconnect()
defer handle.Kill(ctx)
// work
```

### Error Handling

```python
result = pty_handle.wait()
if result.exit_code != 0:
    print(f"Failed: {result.exit_code}, Error: {result.error}")
```

```typescript
const result = await ptyHandle.wait()
if (result.exitCode !== 0) console.log(`Failed: ${result.exitCode}, Error: ${result.error}`)
```

```ruby
pty_handle.each { |data| print data }
if pty_handle.exit_code != 0
  puts "Failed: #{pty_handle.exit_code}, Error: #{pty_handle.error}"
end
```

```go
result, err := handle.Wait(ctx)
if err != nil { log.Fatal(err) }
if result.ExitCode != nil && *result.ExitCode != 0 {
	fmt.Printf("Failed: %d, Error: %s\n", *result.ExitCode, *result.Error)
}
```
