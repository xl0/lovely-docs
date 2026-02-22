## Configuration Methods

Daytona supports configuration in order of precedence:
1. Configuration in code
2. Environment variables
3. .env file
4. Default values

## Configuration in Code

Use the `DaytonaConfig` class with parameters:
- `api_key`: Your Daytona API Key
- `api_url`: URL of your Daytona API
- `target`: Target region (`us` / `eu`)

**Python:**
```python
from daytona import DaytonaConfig

config = DaytonaConfig(
    api_key="your-api-key",
    api_url="your-api-url",
    target="us"
)
```

**TypeScript:**
```typescript
import { DaytonaConfig } from '@daytonaio/sdk'

const config: DaytonaConfig = {
  apiKey: 'your-api-key',
  apiUrl: 'your-api-url',
  target: 'us',
}
```

**Ruby:**
```ruby
require 'daytona'

config = Daytona::Config.new(
  api_key: 'your-api-key',
  api_url: 'your-api-url',
  target: 'us'
)
```

**Go:**
```go
package main

import "github.com/daytonaio/daytona/libs/sdk-go/pkg/daytona"

func main() {
    config := daytona.Config{
        APIKey: "your-api-key",
        APIURL: "your-api-url",
        Target: "us",
    }
    client := daytona.NewClient(&config)
}
```

## Environment Variables

The SDK automatically reads these environment variables:

| Variable | Description | Required |
|----------|-------------|----------|
| `DAYTONA_API_KEY` | Your Daytona API key | Yes |
| `DAYTONA_API_URL` | URL of your Daytona API | No |
| `DAYTONA_TARGET` | Target region for sandboxes | No |

**Bash/Zsh:**
```bash
export DAYTONA_API_KEY=your-api-key
export DAYTONA_API_URL=https://your-api-url
export DAYTONA_TARGET=us
```

**Windows PowerShell:**
```powershell
$env:DAYTONA_API_KEY="your-api-key"
$env:DAYTONA_API_URL="https://your-api-url"
$env:DAYTONA_TARGET="us"
```

## .env File

Create a `.env` file:
```bash
DAYTONA_API_KEY=YOUR_API_KEY
DAYTONA_API_URL=https://your_api_url
DAYTONA_TARGET=us
```

## Default Values

If no configuration is provided:

| Option | Value |
|--------|-------|
| API URL | https://app.daytona.io/api |
| Target | Default region for the organization |