## ComputerUse API

Desktop automation with mouse, keyboard, screenshot, display, and recording.

**ComputerUse**: `start()`, `stop()`, `get_status()`, `get_process_status(name)`, `restart_process(name)`, `get_process_logs(name)`, `get_process_errors(name)`

**Mouse**: `get_position()`, `move(x, y)`, `click(x, y, button="left", double=False)`, `drag(start_x, start_y, end_x, end_y, button="left")`, `scroll(x, y, direction, amount=1)`

**Keyboard**: `type(text, delay=None)`, `press(key, modifiers=None)`, `hotkey(keys)`

**Screenshot**: `take_full_screen(show_cursor=False)`, `take_region(region, show_cursor=False)`, `take_compressed(options=None)`, `take_compressed_region(region, options=None)`. ScreenshotRegion: x, y, width, height. ScreenshotOptions: show_cursor, fmt ('png'/'jpeg'/'webp'), quality (0-100), scale.

**Display**: `get_info()`, `get_windows()`

**RecordingService**: `start(label=None)`, `stop(id)`, `list()`, `get(id)`, `delete(id)`, `download(id, path)`

```python
sandbox.computer_use.start()
sandbox.computer_use.mouse.click(100, 200)
sandbox.computer_use.keyboard.type("text")
sandbox.computer_use.keyboard.hotkey("ctrl+c")
screenshot = sandbox.computer_use.screenshot.take_full_screen()
recording = sandbox.computer_use.recording.start("label")
sandbox.computer_use.recording.stop(recording.id)
```