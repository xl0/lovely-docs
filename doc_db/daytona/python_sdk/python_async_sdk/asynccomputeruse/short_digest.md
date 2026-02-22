## AsyncComputerUse

Desktop automation with mouse, keyboard, screenshot, display, and recording.

### Lifecycle
```python
await sandbox.computer_use.start()
await sandbox.computer_use.stop()
await sandbox.computer_use.get_status()
await sandbox.computer_use.get_process_status("xvfb")
await sandbox.computer_use.restart_process("xfce4")
```

### Mouse
```python
await sandbox.computer_use.mouse.get_position()
await sandbox.computer_use.mouse.move(100, 200)
await sandbox.computer_use.mouse.click(100, 200, "left", double=False)
await sandbox.computer_use.mouse.drag(50, 50, 150, 150)
await sandbox.computer_use.mouse.scroll(100, 200, "up", 3)
```

### Keyboard
```python
await sandbox.computer_use.keyboard.type("text", delay=100)
await sandbox.computer_use.keyboard.press("Return", ["ctrl", "shift"])
await sandbox.computer_use.keyboard.hotkey("ctrl+c")
```

### Screenshot
```python
screenshot = await sandbox.computer_use.screenshot.take_full_screen(show_cursor=False)
region = ScreenshotRegion(x=100, y=100, width=300, height=200)
screenshot = await sandbox.computer_use.screenshot.take_region(region)
screenshot = await sandbox.computer_use.screenshot.take_compressed(
    ScreenshotOptions(format="jpeg", quality=95, scale=0.5, show_cursor=True)
)
screenshot = await sandbox.computer_use.screenshot.take_compressed_region(region, options)
```

### Display
```python
info = await sandbox.computer_use.display.get_info()  # primary_display, total_displays, displays[]
windows = await sandbox.computer_use.display.get_windows()  # count, windows[]{id, title}
```

### Recording
```python
recording = await sandbox.computer_use.recording.start("label")
await sandbox.computer_use.recording.stop(recording.id)
recordings = await sandbox.computer_use.recording.list()
recording = await sandbox.computer_use.recording.get(recording_id)
await sandbox.computer_use.recording.delete(recording_id)
await sandbox.computer_use.recording.download(recording_id, "local_path")
```