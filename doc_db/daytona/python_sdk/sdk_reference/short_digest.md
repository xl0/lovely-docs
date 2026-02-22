## Installation
```bash
pip install daytona
```

## Quick Start
Create sandbox and execute commands (sync or async):
```python
from daytona import Daytona
daytona = Daytona()
sandbox = daytona.create()
response = sandbox.process.exec("echo 'Hello, World!'")
```

## Configuration
Environment variables: `DAYTONA_API_KEY`, `DAYTONA_API_URL`, `DAYTONA_TARGET`

Or explicit config:
```python
from daytona import DaytonaConfig
config = DaytonaConfig(api_key="...", api_url="...", target="us")
daytona = Daytona(config)
```