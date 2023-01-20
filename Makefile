build:
	docker build -t nestjs-event-driven-demo -f docker/Dockerfile .

start:
	docker compose up -d

stop:
	docker compose down

start-issue1:
	docker compose --profile=issue1 up -d

stop-issue1:
	docker compose --profile=issue1 down

start-step1:
	docker compose --profile=step1 up -d

stop-step1:
	docker compose --profile=step1 down

start-step2:
	docker compose --profile=step2 up -d

stop-step2:
	docker compose --profile=step2 down

watch:
	docker compose logs -f

watch-cron:
	docker compose logs -f cron*

monitor:
	yarn start:monitor
