## Quick Start

1. Create account and get API key from Daytona Dashboard
2. Install SDK: `pip install daytona` (Python), `npm install @daytonaio/sdk` (TypeScript), `gem install daytona` (Ruby)
3. Create sandbox and run code:

```python
from daytona import Daytona, DaytonaConfig
daytona = Daytona(DaytonaConfig(api_key="YOUR_API_KEY"))
sandbox = daytona.create()
response = sandbox.process.code_run('print("Hello World")')
print(response.result)
sandbox.delete()
```

```typescript
import { Daytona } from '@daytonaio/sdk'
const daytona = new Daytona({ apiKey: 'YOUR_API_KEY' })
const sandbox = await daytona.create({ language: 'typescript' })
const response = await sandbox.process.codeRun('console.log("Hello World")')
console.log(response.result)
await sandbox.delete()
```

```ruby
require 'daytona'
daytona = Daytona::Daytona.new(Daytona::Config.new(api_key: 'your-api-key'))
sandbox = daytona.create
response = sandbox.process.code_run(code: 'print("Hello World")')
puts response.result
daytona.delete(sandbox)
```