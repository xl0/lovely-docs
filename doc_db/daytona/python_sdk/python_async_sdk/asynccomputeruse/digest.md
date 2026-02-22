## AsyncComputerUse

Main class for desktop automation. Provides access to mouse, keyboard, screenshot, display, and recording operations.

### Lifecycle Methods

```python
result = await sandbox.computer_use.start()
result = await sandbox.computer_use.stop()
```

Starts/stops all computer use processes (Xvfb, xfce4, x11vnc, novnc).

### Status Methods

```python
response = await sandbox.computer_use.get_status()
xvfb_status = await sandbox.computer_use.get_process_status("xvfb")
result = await sandbox.computer_use.restart_process("xfce4")
logs = await sandbox.computer_use.get_process_logs("novnc")
errors = await sandbox.computer_use.get_process_errors("x11vnc")
```

## AsyncMouse

### Position and Movement

```python
position = await sandbox.computer_use.mouse.get_position()
result = await sandbox.computer_use.mouse.move(100, 200)
```

### Clicking

```python
# Single left click
await sandbox.computer_use.mouse.click(100, 200)

# Double click
await sandbox.computer_use.mouse.click(100, 200, "left", True)

# Right click
await sandbox.computer_use.mouse.click(100, 200, "right")
```

### Dragging and Scrolling

```python
result = await sandbox.computer_use.mouse.drag(50, 50, 150, 150)

# Scroll up
await sandbox.computer_use.mouse.scroll(100, 200, "up", 3)

# Scroll down
await sandbox.computer_use.mouse.scroll(100, 200, "down", 5)
```

## AsyncKeyboard

### Text Input

```python
await sandbox.computer_use.keyboard.type("Hello, World!")
await sandbox.computer_use.keyboard.type("Slow typing", 100)  # 100ms delay between chars
```

### Key Presses

```python
# Single key
await sandbox.computer_use.keyboard.press("Return")

# With modifiers
await sandbox.computer_use.keyboard.press("c", ["ctrl"])
await sandbox.computer_use.keyboard.press("t", ["ctrl", "shift"])
```

### Hotkeys

```python
await sandbox.computer_use.keyboard.hotkey("ctrl+c")
await sandbox.computer_use.keyboard.hotkey("ctrl+v")
await sandbox.computer_use.keyboard.hotkey("alt+tab")
```

## AsyncScreenshot

### Full Screen

```python
screenshot = await sandbox.computer_use.screenshot.take_full_screen()
with_cursor = await sandbox.computer_use.screenshot.take_full_screen(True)
```

Returns `ScreenshotResponse` with base64 encoded image, width, height.

### Region Capture

```python
region = ScreenshotRegion(x=100, y=100, width=300, height=200)
screenshot = await sandbox.computer_use.screenshot.take_region(region)
```

### Compressed Screenshots

```python
# Default compression
screenshot = await sandbox.computer_use.screenshot.take_compressed()

# High quality JPEG
jpeg = await sandbox.computer_use.screenshot.take_compressed(
    ScreenshotOptions(format="jpeg", quality=95, show_cursor=True)
)

# Scaled down PNG
scaled = await sandbox.computer_use.screenshot.take_compressed(
    ScreenshotOptions(format="png", scale=0.5)
)

# Compressed region
region = ScreenshotRegion(x=0, y=0, width=800, height=600)
screenshot = await sandbox.computer_use.screenshot.take_compressed_region(
    region,
    ScreenshotOptions(format="webp", quality=80, show_cursor=True)
)
```

## AsyncDisplay

```python
info = await sandbox.computer_use.display.get_info()
print(f"Primary: {info.primary_display.width}x{info.primary_display.height}")
print(f"Total displays: {info.total_displays}")
for display in info.displays:
    print(f"{display.width}x{display.height} at {display.x},{display.y}")

windows = await sandbox.computer_use.display.get_windows()
for window in windows.windows:
    print(f"{window.title} (ID: {window.id})")
```

## AsyncRecordingService

### Recording Lifecycle

```python
recording = await sandbox.computer_use.recording.start("my-test-recording")
print(f"Recording ID: {recording.id}, File: {recording.file_path}")

result = await sandbox.computer_use.recording.stop(recording.id)
print(f"Duration: {result.duration_seconds}s, Saved to: {result.file_path}")
```

### Listing and Retrieval

```python
recordings = await sandbox.computer_use.recording.list()
for rec in recordings.recordings:
    print(f"{rec.file_name}: {rec.status}")

recording = await sandbox.computer_use.recording.get(recording_id)
print(f"{recording.file_name}, Status: {recording.status}, Duration: {recording.duration_seconds}s")
```

### Management

```python
await sandbox.computer_use.recording.delete(recording_id)
await sandbox.computer_use.recording.download(recording_id, "local_recording.mp4")
```

## Data Models

**ScreenshotRegion**: `x`, `y`, `width`, `height` - region coordinates for screenshot operations.

**ScreenshotOptions**: `show_cursor` (bool), `fmt` (str: 'png'/'jpeg'/'webp'), `quality` (0-100), `scale` (float) - compression and display options.