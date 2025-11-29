## PostgreSQL Local Setup with Docker

Pull image: `docker pull postgres` (or `postgres:15` for specific version)

Start container:
```bash
docker run --name drizzle-postgres -e POSTGRES_PASSWORD=mypassword -d -p 5432:5432 postgres
```

Connection URL: `postgres://postgres:mypassword@localhost:5432/postgres`

Optional: `-e POSTGRES_USER=` and `-e POSTGRES_DB=` to customize username and database name.