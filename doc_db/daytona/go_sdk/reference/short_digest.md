## Installation

```bash
go get github.com/daytonaio/daytona/libs/sdk-go
```

## Quick Start

```go
client, _ := daytona.NewClient() // uses env vars: DAYTONA_API_KEY, DAYTONA_API_URL, DAYTONA_TARGET
sandbox, _ := client.Create(context.Background(), nil)
response, _ := sandbox.Process.ExecuteCommand(context.Background(), "echo 'Hello, World!'")
```

Or with explicit config:
```go
config := &types.DaytonaConfig{APIKey: "...", APIUrl: "https://app.daytona.io/api", Target: "us"}
client, _ := daytona.NewClientWithConfig(config)
```