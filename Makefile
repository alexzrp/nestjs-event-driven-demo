build:
	docker build --pull -t nestjs-event-driven-demo -f docker/Dockerfile .

start:
	docker compose up -d

stop:
	docker compose down

start-issue1:
	docker compose -f docker-compose-issue1.yml up -d

stop-issue1:
	docker compose -f docker-compose-issue1.yml down

start-step1:
	docker compose -f docker-compose-step1.yml up -d

stop-step1:
	docker compose -f docker-compose-step1.yml down

start-step2:
	docker compose -f docker-compose-step2.yml up -d

stop-step2:
	docker compose -f docker-compose-step2.yml down

watch:
	docker logs -f nestjs-event-driven-demo-worker-1

watch-cron:
	docker logs -f nestjs-event-driven-demo-cron-1

monitor:
	yarn start:monitor
