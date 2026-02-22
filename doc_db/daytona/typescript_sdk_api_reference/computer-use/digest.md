## ComputerUse

Main interface providing access to desktop automation through mouse, keyboard, screenshot, display, and recording operations.

**Properties**: `display`, `keyboard`, `mouse`, `recording`, `screenshot`

### Lifecycle Methods

```typescript
await sandbox.computerUse.start();  // Start all processes (Xvfb, xfce4, x11vnc, novnc)
await sandbox.computerUse.stop();   // Stop all processes
```

### Process Management

```typescript
const status = await sandbox.computerUse.getStatus();
const processStatus = await sandbox.computerUse.getProcessStatus('xvfb');
const logs = await sandbox.computerUse.getProcessLogs('novnc');
const errors = await sandbox.computerUse.getProcessErrors('x11vnc');
await sandbox.computerUse.restartProcess('xfce4');
```

## Keyboard

```typescript
await sandbox.computerUse.keyboard.type('Hello, World!', 100); // with delay
await sandbox.computerUse.keyboard.press('Return');
await sandbox.computerUse.keyboard.press('c', ['ctrl']);
await sandbox.computerUse.keyboard.press('t', ['ctrl', 'shift']);
await sandbox.computerUse.keyboard.hotkey('ctrl+c');
await sandbox.computerUse.keyboard.hotkey('alt+tab');
```

## Mouse

```typescript
const result = await sandbox.computerUse.mouse.click(100, 200);
await sandbox.computerUse.mouse.click(100, 200, 'left', true);  // double-click
await sandbox.computerUse.mouse.click(100, 200, 'right');       // right-click

const position = await sandbox.computerUse.mouse.getPosition();
await sandbox.computerUse.mouse.move(100, 200);
await sandbox.computerUse.mouse.drag(50, 50, 150, 150);
await sandbox.computerUse.mouse.scroll(100, 200, 'down', 5);
```

## Screenshot

```typescript
const screenshot = await sandbox.computerUse.screenshot.takeFullScreen();
const withCursor = await sandbox.computerUse.screenshot.takeFullScreen(true);

const region = { x: 100, y: 100, width: 300, height: 200 };
const regionShot = await sandbox.computerUse.screenshot.takeRegion(region);

// Compressed versions
const compressed = await sandbox.computerUse.screenshot.takeCompressed({
  format: 'jpeg',
  quality: 95,
  showCursor: true
});

const regionCompressed = await sandbox.computerUse.screenshot.takeCompressedRegion(region, {
  format: 'webp',
  quality: 80,
  scale: 0.5
});
```

Returns `ScreenshotResponse` with `width`, `height`, `size_bytes`, and base64 encoded image data.

## Display

```typescript
const info = await sandbox.computerUse.display.getInfo();
// Returns: primary_display, total_displays, displays array with width/height/x/y

const windows = await sandbox.computerUse.display.getWindows();
// Returns: count, windows array with id and title
```

## RecordingService

```typescript
const recording = await sandbox.computerUse.recording.start('my-test-recording');
const stopped = await sandbox.computerUse.recording.stop(recording.id);
// Returns: id, fileName, filePath, status, durationSeconds

const recordings = await sandbox.computerUse.recording.list();
const details = await sandbox.computerUse.recording.get(recordingId);
await sandbox.computerUse.recording.download(recordingId, 'local_recording.mp4');
await sandbox.computerUse.recording.delete(recordingId);
```