## Installation

```bash
go get github.com/daytonaio/daytona/libs/sdk-go
```

## Getting Started

Create and interact with sandboxes:

```go
package main

import (
	"context"
	"fmt"
	"log"
	"github.com/daytonaio/daytona/libs/sdk-go/pkg/daytona"
	"github.com/daytonaio/daytona/libs/sdk-go/pkg/types"
)

func main() {
	// Initialize with environment variables (DAYTONA_API_KEY, DAYTONA_API_URL, DAYTONA_TARGET)
	client, err := daytona.NewClient()
	if err != nil {
		log.Fatal(err)
	}

	// Or with explicit config
	config := &types.DaytonaConfig{
		APIKey: "YOUR_API_KEY",
		APIUrl: "https://app.daytona.io/api",
		Target: "us",
	}
	client, _ = daytona.NewClientWithConfig(config)

	// Create a sandbox
	sandbox, err := client.Create(context.Background(), nil)
	if err != nil {
		log.Fatal(err)
	}

	// Execute commands
	response, err := sandbox.Process.ExecuteCommand(context.Background(), "echo 'Hello, World!'")
	if err != nil {
		log.Fatal(err)
	}
	fmt.Println(response.Result)
}
```

## Configuration

Configure via environment variables or `DaytonaConfig` struct with `APIKey`, `APIUrl`, and `Target` fields. Use `NewClient()` for environment-based config or `NewClientWithConfig()` for explicit configuration.