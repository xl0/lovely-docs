## MDX Components for Documentation

This page documents all reusable MDX components used throughout the Drizzle ORM documentation.

### Installation Components
- **Npm**: Displays npm package installation commands. Usage: `<Npm>drizzle-orm</Npm>` or `<Npm>drizzle-orm -D drizzle-kit</Npm>`

### Navigation Components
- **AnchorCards**: Creates a grid of anchor links to page sections. Pass object with label-to-anchor mappings: `<AnchorCards cards={{ Anchor1: "#anchor1", Anchor2: "#anchor2" }} />`

### Content Components
- **Callout**: Highlighted callout boxes with optional emoji and types (info, warning, error). Examples:
  - `<Callout emoji={"😀"}>Callout example</Callout>`
  - `<Callout type={"warning"}>Callout example</Callout>`

- **CodeTabs**: Multi-tab code display with file names. Supports syntax highlighting and copy buttons:
  ```
  <CodeTabs items={["index.ts", "schema.ts"]}>
    <CodeTab>```typescript copy /schema/3
    // code here
    ```</CodeTab>
  </CodeTabs>
  ```

- **Section**: Container for related code blocks (TypeScript + SQL pairs)

- **Tabs**: Generic tabbed content for database-specific variations (PostgreSQL, MySQL, SQLite). Each tab contains a Section with language-specific code examples

### Feature Support
- **IsSupportedChipGroup**: Shows database support status. Example: `<IsSupportedChipGroup chips={{ PostgreSQL: true, SQLite: true, MySQL: false }} />`

### Reference Components
- **SimpleLinkCards**: Grid of links to related documentation pages. Example: `<SimpleLinkCards cards={{ "PostgreSQL column types": "/docs/column-types/pg" }} />`

- **Steps**: Numbered instruction steps with h4 headers and code blocks for multi-step processes

- **YoutubeCards**: Embeds YouTube video cards with title, description, and duration. Pass array of objects with id, title, description, time

### Code Block Features
- **copy**: Adds copy-to-clipboard button
- **/pattern/number**: Highlights specific lines matching pattern
- **filename**: Shows file path above code block
- **collapsable**: Makes code block collapsible (useful for long schemas)