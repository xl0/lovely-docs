## ComputerUse API

Desktop automation interface with lifecycle control:
```typescript
await sandbox.computerUse.start();
await sandbox.computerUse.stop();
```

**Keyboard**: `type()`, `press(key, modifiers)`, `hotkey(keys)`

**Mouse**: `click(x, y, button, double)`, `move()`, `drag()`, `scroll(x, y, direction, amount)`, `getPosition()`

**Screenshot**: `takeFullScreen(showCursor)`, `takeRegion(region, showCursor)`, `takeCompressed(options)`, `takeCompressedRegion(region, options)` with format/quality/scale/showCursor options

**Display**: `getInfo()` returns primary_display and displays array; `getWindows()` returns open windows with id/title

**Recording**: `start(label)`, `stop(id)`, `list()`, `get(id)`, `download(id, path)`, `delete(id)`

**Process Management**: `getStatus()`, `getProcessStatus(name)`, `getProcessLogs(name)`, `getProcessErrors(name)`, `restartProcess(name)`