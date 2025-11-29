## Setup MySQL locally with Docker

### Prerequisites
- Install Docker Desktop for your operating system

### Pull MySQL Image
Pull the latest MySQL image from Docker Hub:
```bash
docker pull mysql
```

Or pull a specific version:
```bash
docker pull mysql:8.2
```

Verify the image is downloaded with `docker images`.

### Start MySQL Container
Run a MySQL container with:
```bash
docker run --name drizzle-mysql -e MYSQL_ROOT_PASSWORD=mypassword -d -p 3306:3306 mysql
```

Command options:
- `--name drizzle-mysql`: Container name
- `-e MYSQL_ROOT_PASSWORD=mypassword`: Root user password
- `-d`: Run in detached mode (background)
- `-p 3306:3306`: Map container port 3306 to host port 3306
- `mysql`: Image name (can specify version like `mysql:8.2`)

Optional parameters:
- `-e MYSQL_DATABASE=`: Create a database on startup (default: `mysql`)
- `-e MYSQL_USER=` and `-e MYSQL_PASSWORD=`: Create a new user with password (still requires `MYSQL_ROOT_PASSWORD`)

Verify container is running with `docker ps`.

### Configure Database URL
Connection URL format:
```plaintext
mysql://<user>:<password>@<host>:<port>/<database>
```

Example for the created container:
```plaintext
mysql://root:mypassword@localhost:3306/mysql
```

Use this URL to connect to the database in your application.