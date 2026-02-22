## Overview

Daytona is an open-source, secure and elastic infrastructure for running AI-generated code. It provides isolated sandbox environments managed programmatically via SDK (Python, TypeScript, Ruby).

## Account Setup

1. Create account at Daytona Dashboard with email/password or Google/GitHub
2. Generate API key from dashboard (save securely, won't be shown again)

## Installation

```bash
# Python
pip install daytona

# TypeScript
npm install @daytonaio/sdk

# Ruby
gem install daytona
```

## Configuration

Daytona supports configuration via: in-code, environment variables, .env file, or default values.

## Create and Run Code in Sandbox

**Python:**
```python
from daytona import Daytona, DaytonaConfig

config = DaytonaConfig(api_key="YOUR_API_KEY")
daytona = Daytona(config)
sandbox = daytona.create()

response = sandbox.process.code_run('print("Hello World")')
if response.exit_code != 0:
    print(f"Error: {response.exit_code} {response.result}")
else:
    print(response.result)

sandbox.delete()
```

**TypeScript:**
```typescript
import { Daytona } from '@daytonaio/sdk'

const daytona = new Daytona({ apiKey: 'YOUR_API_KEY' })
const sandbox = await daytona.create({ language: 'typescript' })

const response = await sandbox.process.codeRun('console.log("Hello World")')
if (response.exitCode !== 0) {
    console.error(`Error: ${response.exitCode} ${response.result}`)
} else {
    console.log(response.result)
}

await sandbox.delete()
```

**Ruby:**
```ruby
require 'daytona'

config = Daytona::Config.new(api_key: 'your-api-key')
daytona = Daytona::Daytona.new(config)
sandbox = daytona.create

response = sandbox.process.code_run(code: 'print("Hello World")')
if response.exit_code != 0
    puts "Error: #{response.exit_code} #{response.result}"
else
    puts response.result
end

daytona.delete(sandbox)
```

## Running Code

Execute with: `python main.py`, `npx tsx index.mts`, or `ruby main.rb`

## Additional Resources

LLM context files available: llms-full.txt and llms.txt for faster AI agent development.