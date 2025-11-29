**generate** creates SQL migration files (not auto-applied); **push** syncs schema directly to database (local dev only).

PostgreSQL indexes with expressions require manual naming: `index('name').on(sql\`lower(...)\`)`. Push won't detect changes to index expressions, `.where()`, or operator classes—use generate for those, or comment/uncomment/push twice.