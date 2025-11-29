## Getting Started with Drizzle ORM and Bun:SQLite

### Prerequisites
- **bun** - JavaScript all-in-one toolkit
- **bun:sqlite** - native high-performance SQLite3 driver

### Installation
Install required packages:
```
npm install drizzle-orm
npm install -D drizzle-kit @types/bun
```

### Setup Connection Variables
Create environment variable for database file location:
```
DB_FILE_NAME=mydb.sqlite
```

### Connect to Database
Use Drizzle ORM to establish connection to bun:sqlite database.

### Create Tables
Define your database schema using Drizzle ORM table definitions.

### Configure Drizzle
Setup drizzle.config.ts with SQLite dialect and DB_FILE_NAME environment variable.

### Apply Migrations
Run migrations to apply schema changes to the database.

### Seed and Query
Write queries to seed initial data and query the database using Drizzle ORM.

### Run Application
Execute your script with:
```bash
bun src/index.ts
```