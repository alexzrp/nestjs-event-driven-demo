import { Injectable } from '@nestjs/common';
import {
  JOB_ANALYTICS,
  JOB_NOTIFICATION,
  JOB_STORE,
  JOB_TRADE_CONFIRM,
  QUEUE_DEFAULT,
} from './const';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { AsyncApiPub } from 'nestjs-asyncapi';
import { TradeCreatedDto } from './dto/trade-created.dto';

@Injectable()
export class CommonService {
  constructor(@InjectQueue(QUEUE_DEFAULT) private queue: Queue) {}

  addAnalytics(payload: unknown, options) {
    return this.queue.add(JOB_ANALYTICS, payload, options);
  }

  @AsyncApiPub({
    channel: 'default/notification',
    message: {
      payload: TradeCreatedDto,
    },
  })
  addNotification(payload, options) {
    return this.queue.add(JOB_NOTIFICATION, payload, options);
  }

  @AsyncApiPub({
    channel: 'default/store',
    message: {
      payload: TradeCreatedDto,
    },
  })
  addStore(payload, options) {
    return this.queue.add(JOB_STORE, payload, options);
  }

  @AsyncApiPub({
    channel: 'default/trade',
    message: {
      payload: TradeCreatedDto,
    },
  })
  addTrade(payload, options) {
    return this.queue.add(JOB_TRADE_CONFIRM, payload, options);
  }
}
