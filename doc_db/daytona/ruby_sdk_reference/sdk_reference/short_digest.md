## Installation

```ruby
gem 'daytona'
```

## Quick Start

```ruby
require 'daytona'
daytona = Daytona::Daytona.new
sandbox = daytona.create
sandbox.process.exec(command: "echo 'Hello, World!'")
daytona.delete(sandbox)
```

## Configuration

Via environment variables or constructor with `Daytona::Config` (api_key, api_url, target). Supports `DAYTONA_API_KEY`, `DAYTONA_JWT_TOKEN` + `DAYTONA_ORGANIZATION_ID`, `DAYTONA_API_URL`, `DAYTONA_TARGET`.