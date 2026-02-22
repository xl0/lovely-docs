## Installation

Install via Bundler:
```ruby
gem 'daytona'
```

Or directly:
```bash
gem install daytona
```

## Getting Started

```ruby
require 'daytona'

daytona = Daytona::Daytona.new
sandbox = daytona.create
response = sandbox.process.exec(command: "echo 'Hello, World!'")
puts response.result
daytona.delete(sandbox)
```

## Configuration

Configure via environment variables or constructor:

```ruby
# Environment variables (DAYTONA_API_KEY, DAYTONA_API_URL, DAYTONA_TARGET)
daytona = Daytona::Daytona.new

# Explicit configuration
config = Daytona::Config.new(
  api_key: 'your-api-key',
  api_url: 'https://app.daytona.io/api',
  target: 'us'
)
daytona = Daytona::Daytona.new(config)
```

## Environment Variables

| Variable | Description |
|----------|-------------|
| `DAYTONA_API_KEY` | API key for authentication |
| `DAYTONA_API_URL` | URL of the Daytona API (defaults to `https://app.daytona.io/api`) |
| `DAYTONA_TARGET` | Target location for Sandboxes |
| `DAYTONA_JWT_TOKEN` | JWT token for authentication (alternative to API key) |
| `DAYTONA_ORGANIZATION_ID` | Organization ID (required when using JWT token) |