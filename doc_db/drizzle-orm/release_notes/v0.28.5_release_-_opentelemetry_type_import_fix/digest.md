## v0.28.5 Release - OpenTelemetry Type Import Fix

**Fix:** Corrected an incorrect OpenTelemetry type import that caused a runtime error.

**Context:** The OpenTelemetry implementation in drizzle-orm is currently disabled and non-functional. It was an experimental feature designed to allow users to collect query statistics and send them to their own telemetry consumers, but it was disabled before release and does nothing in the current version. Drizzle itself does not collect or send any statistics.

**Root Cause:** The issue occurred due to incorrect import syntax on the tracing.ts file. The code used `import { type ... }` instead of the correct `import type { ... }` syntax. This caused the `import '@opentelemetry/api'` statement to leak into the runtime instead of being tree-shaken during compilation, resulting in a runtime error.

**Impact:** This was a critical fix for users experiencing runtime errors related to OpenTelemetry imports, even though the OpenTelemetry functionality itself is not active.