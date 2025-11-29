## Setup PostgreSQL with Docker

**Prerequisites:** Docker Desktop installed

**Pull PostgreSQL Image**
Pull the latest PostgreSQL image from Docker Hub:
```bash
docker pull postgres
```
Or pull a specific version:
```bash
docker pull postgres:15
```
Verify the image is downloaded with `docker images`.

**Start PostgreSQL Container**
Run a new PostgreSQL container:
```bash
docker run --name drizzle-postgres -e POSTGRES_PASSWORD=mypassword -d -p 5432:5432 postgres
```

Key options:
- `--name drizzle-postgres`: Container name
- `-e POSTGRES_PASSWORD=mypassword`: Set password
- `-d`: Run in detached mode (background)
- `-p 5432:5432`: Map container port 5432 to host port 5432
- `postgres`: Image name (can specify version like `postgres:15`)

Optional parameters:
- `-e POSTGRES_USER=`: Set username (defaults to `postgres`)
- `-e POSTGRES_DB=`: Set database name (defaults to `POSTGRES_USER` value)

Verify container is running with `docker ps`.

**Configure Database URL**
Connection URL format:
```
postgres://<user>:<password>@<host>:<port>/<database>
```

Example for the created container:
```
postgres://postgres:mypassword@localhost:5432/postgres
```

Use this URL to connect to the database in your application.