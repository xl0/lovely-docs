## Config

Main class for configuring Daytona SDK authentication and API connection.

### Constructor

```ruby
Daytona::Config.new(
  api_key: ENV['DAYTONA_API_KEY'],
  jwt_token: ENV['DAYTONA_JWT_TOKEN'],
  api_url: ENV['DAYTONA_API_URL'] || Daytona::Config::API_URL,
  organization_id: ENV['DAYTONA_ORGANIZATION_ID'],
  target: ENV['DAYTONA_TARGET'],
  _experimental: nil
)
```

All parameters are optional and default to environment variables or built-in defaults.

### Properties

All properties have getter and setter methods:

- `api_key` - String for API authentication
- `jwt_token` - String for JWT authentication
- `api_url` - String for Daytona API endpoint
- `organization_id` - String for organization identification
- `target` - String for sandbox target environment
- `_experimental` - Hash for experimental configuration options