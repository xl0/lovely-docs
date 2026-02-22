## VNC Access

Provides graphical desktop environment for Daytona Sandbox in browser. Works with Computer Use to enable both manual and automated desktop interactions.

### Use Cases
- GUI application development and testing
- Browser testing in full browser environment
- Visual debugging of graphical output
- Desktop tool access (IDEs, design tools)
- Observing AI agents performing automated tasks

### Requirements
VNC and Computer Use require default sandbox image. Custom images need manual package installation.

### Access from Dashboard
1. Navigate to Daytona Sandboxes
2. Locate sandbox, click options menu (⋮)
3. Select VNC from dropdown
4. Click Connect button in VNC viewer

VNC sessions remain active while sandbox runs. Auto-stopped sandboxes require restart before reconnecting.

### Programmatic VNC Management

**Start VNC** - Start all VNC processes (Xvfb, xfce4, x11vnc, novnc):
```python
result = sandbox.computer_use.start()
print("VNC processes started:", result.message)
```
```typescript
const result = await sandbox.computerUse.start();
console.log('VNC processes started:', result.message);
```
```ruby
result = sandbox.computer_use.start
puts "VNC processes started: #{result.message}"
```
```go
err := sandbox.ComputerUse.Start(ctx)
if err != nil { log.Fatal(err) }
defer sandbox.ComputerUse.Stop(ctx)
fmt.Println("VNC processes started")
```
```bash
curl 'https://proxy.app.daytona.io/toolbox/{sandboxId}/computeruse/start' --request POST
```

**Stop VNC** - Stop all VNC processes:
```python
result = sandbox.computer_use.stop()
```
```typescript
const result = await sandbox.computerUse.stop();
```
```ruby
result = sandbox.computer_use.stop
```
```go
err := sandbox.ComputerUse.Stop(ctx)
```
```bash
curl 'https://proxy.app.daytona.io/toolbox/{sandboxId}/computeruse/stop' --request POST
```

**Get VNC Status** - Check if VNC processes are running:
```python
response = sandbox.computer_use.get_status()
print("VNC status:", response.status)
```
```typescript
const status = await sandbox.computerUse.getStatus();
console.log('VNC status:', status.status);
```
```ruby
response = sandbox.computer_use.status
puts "VNC status: #{response.status}"
```
```go
status, err := sandbox.ComputerUse.GetStatus(ctx)
fmt.Printf("VNC status: %v\n", status["status"])
```
```bash
curl 'https://proxy.app.daytona.io/toolbox/{sandboxId}/computeruse/status'
```

### Automating Desktop Interactions

Once VNC is running, use Computer Use to automate:
- **Mouse**: click, move, drag, scroll, get cursor position
- **Keyboard**: type text, press keys, execute hotkey combinations
- **Screenshot**: capture full screen, regions, or compressed images
- **Display**: get display information, list open windows

Example - Automated browser interaction:
```python
sandbox.computer_use.start()
sandbox.computer_use.mouse.click(50, 50)
sandbox.computer_use.keyboard.type("https://www.daytona.io/docs/")
sandbox.computer_use.keyboard.press("Return")
screenshot = sandbox.computer_use.screenshot.take_full_screen()
```
```typescript
await sandbox.computerUse.start();
await sandbox.computerUse.mouse.click(50, 50);
await sandbox.computerUse.keyboard.type('https://www.daytona.io/docs/');
await sandbox.computerUse.keyboard.press('Return');
const screenshot = await sandbox.computerUse.screenshot.takeFullScreen();
```

### Required Packages for Custom Images

**VNC and desktop environment:**
- `xvfb` - X Virtual Framebuffer for headless display
- `xfce4` - Desktop environment
- `xfce4-terminal` - Terminal emulator
- `x11vnc` - VNC server
- `novnc` - Web-based VNC client
- `dbus-x11` - D-Bus session support

**X11 libraries:**
- `libx11-6` - X11 client library
- `libxrandr2` - X11 RandR extension (display configuration)
- `libxext6` - X11 extensions library
- `libxrender1` - X11 rendering extension
- `libxfixes3` - X11 fixes extension
- `libxss1` - X11 screen saver extension
- `libxtst6` - X11 testing extension (input simulation)
- `libxi6` - X11 input extension