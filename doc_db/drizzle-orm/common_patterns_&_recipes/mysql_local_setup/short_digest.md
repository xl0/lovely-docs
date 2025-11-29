## MySQL Local Setup with Docker

Pull MySQL image:
```bash
docker pull mysql
```

Start container:
```bash
docker run --name drizzle-mysql -e MYSQL_ROOT_PASSWORD=mypassword -d -p 3306:3306 mysql
```

Connection URL:
```plaintext
mysql://root:mypassword@localhost:3306/mysql
```