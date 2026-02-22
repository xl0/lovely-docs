## Computer Use

Programmatic control of desktop environments within Daytona sandboxes. Provides mouse, keyboard, screenshot, and display operations for automating GUI interactions and testing desktop applications on Linux, Windows, or macOS.

macOS and Windows support is in private alpha; request access via form.

### Common use cases
- GUI Application Testing - automate interactions with native applications, click buttons, fill forms, validate UI behavior
- Visual Testing & Screenshots - capture screenshots, compare UI states, perform visual regression testing
- Desktop Automation - automate repetitive desktop tasks, file management through GUI, complex workflows

### Lifecycle

Start all computer use processes (Xvfb, xfce4, x11vnc, novnc):
```python
result = sandbox.computer_use.start()
```

Stop all processes:
```python
result = sandbox.computer_use.stop()
```

Get status of all processes:
```python
response = sandbox.computer_use.get_status()
```

Get status of specific process (xvfb, novnc, x11vnc, xfce4):
```python
xvfb_status = sandbox.computer_use.get_process_status("xvfb")
```

Restart specific process:
```python
result = sandbox.computer_use.restart_process("xfce4")
```

Get process logs and errors:
```python
logs = sandbox.computer_use.get_process_logs("novnc")
errors = sandbox.computer_use.get_process_errors("x11vnc")
```

### Mouse operations

Click at coordinates with optional button (left/right) and double-click:
```python
sandbox.computer_use.mouse.click(100, 200)  # single left click
sandbox.computer_use.mouse.click(100, 200, "left", True)  # double click
sandbox.computer_use.mouse.click(100, 200, "right")  # right click
```

Move cursor:
```python
result = sandbox.computer_use.mouse.move(100, 200)
```

Drag from start to end coordinates with optional button:
```python
result = sandbox.computer_use.mouse.drag(50, 50, 150, 150)
```

Scroll at coordinates with direction (up/down) and amount:
```python
sandbox.computer_use.mouse.scroll(100, 200, "up", 3)
sandbox.computer_use.mouse.scroll(100, 200, "down", 5)
```

Get current mouse position:
```python
position = sandbox.computer_use.mouse.get_position()
```

### Keyboard operations

Type text with optional delay (ms) between characters:
```python
sandbox.computer_use.keyboard.type("Hello, World!")
sandbox.computer_use.keyboard.type("Slow typing", 100)
```

Press key with optional modifiers (ctrl, shift, alt):
```python
sandbox.computer_use.keyboard.press("Return")
sandbox.computer_use.keyboard.press("c", ["ctrl"])
sandbox.computer_use.keyboard.press("t", ["ctrl", "shift"])
```

Press hotkey combination:
```python
sandbox.computer_use.keyboard.hotkey("ctrl+c")
sandbox.computer_use.keyboard.hotkey("ctrl+v")
sandbox.computer_use.keyboard.hotkey("alt+tab")
```

### Screenshot operations

Take full screen screenshot with optional cursor visibility:
```python
screenshot = sandbox.computer_use.screenshot.take_full_screen()
with_cursor = sandbox.computer_use.screenshot.take_full_screen(True)
```

Take screenshot of region (x, y, width, height):
```python
from daytona import ScreenshotRegion
region = ScreenshotRegion(x=100, y=100, width=300, height=200)
screenshot = sandbox.computer_use.screenshot.take_region(region)
```

Take compressed screenshot with format (jpeg/png/webp), quality (0-100), scale (0-1), and cursor options:
```python
screenshot = sandbox.computer_use.screenshot.take_compressed()
jpeg = sandbox.computer_use.screenshot.take_compressed(
    ScreenshotOptions(format="jpeg", quality=95, show_cursor=True)
)
scaled = sandbox.computer_use.screenshot.take_compressed(
    ScreenshotOptions(format="png", scale=0.5)
)
```

Take compressed screenshot of region:
```python
screenshot = sandbox.computer_use.screenshot.take_compressed_region(
    region,
    ScreenshotOptions(format="webp", quality=80, show_cursor=True)
)
```

### Screen Recording

Configure recording directory via environment variable when creating sandbox:
```python
sandbox = daytona.create(
    CreateSandboxFromSnapshotParams(
        snapshot="daytonaio/sandbox:0.6.0",
        env_vars={"DAYTONA_RECORDINGS_DIR": "/home/daytona/my-recordings"}
    )
)
```

Start recording with optional name:
```python
recording = sandbox.computer_use.recording.start("test-1")
```

Stop recording by ID:
```python
stopped_recording = sandbox.computer_use.recording.stop(recording.id)
```

List all recordings:
```python
recordings_list = sandbox.computer_use.recording.list()
for rec in recordings_list.recordings:
    print(f"- {rec.name}: {rec.duration_seconds}s ({rec.file_size_bytes} bytes)")
```

Get recording details:
```python
recording_detail = sandbox.computer_use.recording.get("recording-id")
```

Delete recording:
```python
sandbox.computer_use.recording.delete("recording-id")
```

Download recording to local file (streams efficiently without loading entire content into memory):
```python
sandbox.computer_use.recording.download(recording.id, "local_recording.mp4")
```

Recording dashboard available in Daytona Dashboard - click action menu for sandbox, select "Screen Recordings" to view, download, and delete recordings through web interface.

### Display operations

Get display information (primary display, total displays, all displays with dimensions and positions):
```python
info = sandbox.computer_use.display.get_info()
print(f"Primary display: {info.primary_display.width}x{info.primary_display.height}")
for i, display in enumerate(info.displays):
    print(f"Display {i}: {display.width}x{display.height} at {display.x},{display.y}")
```

Get list of open windows with title and ID:
```python
windows = sandbox.computer_use.display.get_windows()
for window in windows.windows:
    print(f"- {window.title} (ID: {window.id})")
```

### API and SDK References

All operations available via Python, TypeScript, Ruby, Go SDKs and REST API. API endpoints follow pattern: `https://proxy.app.daytona.io/toolbox/{sandboxId}/computeruse/{operation}`