## ComputerUse

Desktop automation interface providing mouse, keyboard, screenshot, display, and recording operations.

### ComputerUse Class

Main class with attributes: `mouse`, `keyboard`, `screenshot`, `display`, `recording`.

**Methods:**
- `start()` → ComputerUseStartResponse: Starts Xvfb, xfce4, x11vnc, novnc processes
- `stop()` → ComputerUseStopResponse: Stops all processes
- `get_status()` → ComputerUseStatusResponse: Gets status of all VNC processes
- `get_process_status(process_name: str)` → ProcessStatusResponse: Check specific process
- `restart_process(process_name: str)` → ProcessRestartResponse: Restart specific process
- `get_process_logs(process_name: str)` → ProcessLogsResponse: Get process logs
- `get_process_errors(process_name: str)` → ProcessErrorsResponse: Get error logs

```python
result = sandbox.computer_use.start()
status = sandbox.computer_use.get_status()
xvfb_status = sandbox.computer_use.get_process_status("xvfb")
sandbox.computer_use.restart_process("xfce4")
logs = sandbox.computer_use.get_process_logs("novnc")
errors = sandbox.computer_use.get_process_errors("x11vnc")
sandbox.computer_use.stop()
```

### Mouse

**Methods:**
- `get_position()` → MousePositionResponse: Current cursor position
- `move(x: int, y: int)` → MousePositionResponse: Move to coordinates
- `click(x: int, y: int, button: str = "left", double: bool = False)` → MouseClickResponse: Click at position (button: 'left'/'right'/'middle')
- `drag(start_x: int, start_y: int, end_x: int, end_y: int, button: str = "left")` → MouseDragResponse: Drag from start to end
- `scroll(x: int, y: int, direction: str, amount: int = 1)` → bool: Scroll at position (direction: 'up'/'down')

```python
position = sandbox.computer_use.mouse.get_position()
sandbox.computer_use.mouse.move(100, 200)
sandbox.computer_use.mouse.click(100, 200)  # single left click
sandbox.computer_use.mouse.click(100, 200, "left", True)  # double click
sandbox.computer_use.mouse.click(100, 200, "right")  # right click
sandbox.computer_use.mouse.drag(50, 50, 150, 150)
sandbox.computer_use.mouse.scroll(100, 200, "up", 3)
sandbox.computer_use.mouse.scroll(100, 200, "down", 5)
```

### Keyboard

**Methods:**
- `type(text: str, delay: int | None = None)` → None: Type text with optional delay (ms) between characters
- `press(key: str, modifiers: list[str] | None = None)` → None: Press key with modifiers ('ctrl', 'alt', 'meta', 'shift'). Key examples: 'Return', 'Escape', 'Tab', 'a', 'A'
- `hotkey(keys: str)` → None: Press hotkey combination (e.g., 'ctrl+c', 'alt+tab', 'cmd+shift+t')

```python
sandbox.computer_use.keyboard.type("Hello, World!")
sandbox.computer_use.keyboard.type("Slow typing", 100)
sandbox.computer_use.keyboard.press("Return")
sandbox.computer_use.keyboard.press("c", ["ctrl"])  # Ctrl+C
sandbox.computer_use.keyboard.press("t", ["ctrl", "shift"])  # Ctrl+Shift+T
sandbox.computer_use.keyboard.hotkey("ctrl+c")
sandbox.computer_use.keyboard.hotkey("ctrl+v")
sandbox.computer_use.keyboard.hotkey("alt+tab")
```

### Screenshot

**Methods:**
- `take_full_screen(show_cursor: bool = False)` → ScreenshotResponse: Full screen screenshot
- `take_region(region: ScreenshotRegion, show_cursor: bool = False)` → ScreenshotResponse: Screenshot of specific region
- `take_compressed(options: ScreenshotOptions | None = None)` → ScreenshotResponse: Compressed full screen
- `take_compressed_region(region: ScreenshotRegion, options: ScreenshotOptions | None = None)` → ScreenshotResponse: Compressed region screenshot

ScreenshotRegion: `x`, `y`, `width`, `height` (int)

ScreenshotOptions: `show_cursor` (bool), `fmt` (str: 'png'/'jpeg'/'webp'), `quality` (int 0-100), `scale` (float)

```python
screenshot = sandbox.computer_use.screenshot.take_full_screen()
with_cursor = sandbox.computer_use.screenshot.take_full_screen(True)

region = ScreenshotRegion(x=100, y=100, width=300, height=200)
screenshot = sandbox.computer_use.screenshot.take_region(region)

screenshot = sandbox.computer_use.screenshot.take_compressed()
jpeg = sandbox.computer_use.screenshot.take_compressed(
    ScreenshotOptions(format="jpeg", quality=95, show_cursor=True)
)
scaled = sandbox.computer_use.screenshot.take_compressed(
    ScreenshotOptions(format="png", scale=0.5)
)

region = ScreenshotRegion(x=0, y=0, width=800, height=600)
screenshot = sandbox.computer_use.screenshot.take_compressed_region(
    region,
    ScreenshotOptions(format="webp", quality=80, show_cursor=True)
)
```

### Display

**Methods:**
- `get_info()` → DisplayInfoResponse: Display information (primary_display, total_displays, displays list with width, height, x, y)
- `get_windows()` → WindowsResponse: List of open windows (count, windows list with id and title)

```python
info = sandbox.computer_use.display.get_info()
for i, display in enumerate(info.displays):
    print(f"Display {i}: {display.width}x{display.height} at {display.x},{display.y}")

windows = sandbox.computer_use.display.get_windows()
for window in windows.windows:
    print(f"- {window.title} (ID: {window.id})")
```

### RecordingService

**Methods:**
- `start(label: str | None = None)` → Recording: Start recording with optional label
- `stop(recording_id: str)` → Recording: Stop recording
- `list()` → ListRecordingsResponse: List all recordings (active and completed)
- `get(recording_id: str)` → Recording: Get recording details (file_name, status, duration_seconds)
- `delete(recording_id: str)` → None: Delete recording
- `download(recording_id: str, local_path: str)` → None: Download recording file to local path (streamed to disk)

```python
recording = sandbox.computer_use.recording.start("my-test-recording")
result = sandbox.computer_use.recording.stop(recording.id)

recordings = sandbox.computer_use.recording.list()
for rec in recordings.recordings:
    print(f"- {rec.file_name}: {rec.status}")

recording = sandbox.computer_use.recording.get(recording_id)
sandbox.computer_use.recording.download(recording_id, "local_recording.mp4")
sandbox.computer_use.recording.delete(recording_id)
```