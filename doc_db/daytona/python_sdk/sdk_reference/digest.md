## Installation

```bash
pip install daytona
# or
poetry add daytona
```

## Create and Execute in a Sandbox

**Sync:**
```python
from daytona import Daytona

daytona = Daytona()
sandbox = daytona.create()
response = sandbox.process.exec("echo 'Hello, World!'")
print(response.result)
```

**Async:**
```python
import asyncio
from daytona import AsyncDaytona

async def main():
    async with AsyncDaytona() as daytona:
        sandbox = await daytona.create()
        response = await sandbox.process.exec("echo 'Hello, World!'")
        print(response.result)

asyncio.run(main())
```

## Configuration

Configure via environment variables (`DAYTONA_API_KEY`, `DAYTONA_API_URL`, `DAYTONA_TARGET`) or explicit config:

**Sync:**
```python
from daytona import Daytona, DaytonaConfig

daytona = Daytona()  # uses env vars

config = DaytonaConfig(
    api_key="YOUR_API_KEY",
    api_url="https://app.daytona.io/api",
    target="us"
)
daytona = Daytona(config)
```

**Async:**
```python
from daytona import AsyncDaytona, DaytonaConfig

daytona = AsyncDaytona()  # uses env vars
await daytona.close()

config = DaytonaConfig(
    api_key="YOUR_API_KEY",
    api_url="https://app.daytona.io/api",
    target="us"
)
async with AsyncDaytona(config) as daytona:
    pass
```