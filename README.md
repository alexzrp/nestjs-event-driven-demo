# NestJS - Event Driver Architecture (demo)

### Starting the app

Install dependencies: \
`yarn install`

Build image
`make`

Start the stack: use Makefile commands

```makefile
build:
	docker build -t nestjs-event-driven-demo -f docker/Dockerfile .
	docker compose run --rm --no-deps app yarn install
	docker compose run --rm --no-deps app yarn build

start:
	docker compose up -d

stop:
	docker compose down

watch:
	docker compose logs -f

watch-cron:
	docker compose logs -f cron*

monitor:
	yarn start:monitor
```
