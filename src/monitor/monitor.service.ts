import { InjectQueue } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Cron, CronExpression } from '@nestjs/schedule';
import { Queue } from 'bull';
import { QUEUE_DEFAULT, QUEUE_TRADES } from '../common/const';
import Redis from 'ioredis';
import { NotificationService } from '../notification/notification.service';

@Injectable()
export class MonitorService {
  private readonly redis: Redis;

  constructor(
    @InjectQueue(QUEUE_DEFAULT) private queue: Queue,
    @InjectQueue(QUEUE_TRADES) private queueTrades: Queue,
    private readonly config: ConfigService,
    private readonly notificationService: NotificationService,
  ) {
    this.redis = new Redis({
      host: config.get('REDIS_HOST') || '127.0.0.1',
      port: this.config.get('REDIS_PORT') || 6379,
      password: config.get('REDIS_PASSWORD') || undefined,
      db: 2,
    });
  }

  @Cron(CronExpression.EVERY_SECOND)
  async report() {
    const workers_count_default =
      (await this.getWorkersCount('workers:timestamps'))?.length ||
      (await this.getWorkersCount('workers-default:timestamps'))?.length;

    const workers_count_trade =
      (await this.getWorkersCount('workers:timestamps'))?.length ||
      (await this.getWorkersCount('workers-trade:timestamps'))?.length;

    const data = [
      {
        queue: QUEUE_DEFAULT,
        jobs_waiting: await this.queue.getWaitingCount(),
        jobs_completed: await this.queue.getCompletedCount(),
        jobs_delayed: await this.queue.getDelayedCount(),
        workers_count: workers_count_default,
      },
      {
        queue: QUEUE_TRADES,
        jobs_waiting: await this.queueTrades.getWaitingCount(),
        jobs_completed: await this.queueTrades.getCompletedCount(),
        jobs_delayed: await this.queueTrades.getActiveCount(),
        workers_count: workers_count_trade,
      },
    ];

    const output = data.filter((d) => d.jobs_completed > 0);

    if (this.config.get('CONTAINER_ROLE')) {
      console.clear();
      console.table(output);
    } else {
      await this.notificationService.emit(output);
    }
  }

  private async getWorkersCount(name: string) {
    return this.redis.zrangebyscore(name, Date.now() - 2000, Date.now());
  }
}
