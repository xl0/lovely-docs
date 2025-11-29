## Setup Drizzle ORM with Bun and SQLite in an existing project

### Prerequisites
- **dotenv** - for managing environment variables
- **tsx** - for running TypeScript files
- **bun** - JavaScript all-in-one toolkit
- **bun:sqlite** - native high-performance SQLite3 driver

### Installation
Install packages:
```bash
npm install drizzle-orm dotenv
npm install -D drizzle-kit tsx @types/bun
```

### Configuration

1. **Environment variables** - Create `.env` file with database file path:
```plaintext
DB_FILE_NAME=mydb.sqlite
```

2. **Drizzle config** - Setup `drizzle.config.ts` with SQLite dialect and environment variable reference

3. **Database introspection** - Run introspection to generate schema from existing database

4. **Schema file** - Transfer introspected code to your schema file

### Connection Setup
Connect Drizzle ORM to Bun SQLite database using the configured connection

### Usage

Query the database with generated schema:
```bash
bun src/index.ts
```

### Optional: Schema Updates
- Update table schema definitions
- Apply changes to database
- Query database with new fields