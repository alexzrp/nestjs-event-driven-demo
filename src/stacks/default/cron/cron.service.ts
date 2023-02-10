import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { JobOptions } from 'bull';
import { randomUUID } from 'crypto';
import { CommonService } from '../../../common/common.service';

@Injectable()
export class CronService {
  protected readonly logger = new Logger(this.constructor.name);
  private readonly tradesPercycle: number;

  constructor(private commonService: CommonService) {
    this.tradesPercycle = 1;
  }

  @Cron(CronExpression.EVERY_SECOND)
  async generate() {
    const jobOptions = <JobOptions>{
      removeOnComplete: false,
    };
    for (let i = 0; i < this.tradesPercycle + Math.round(Math.random()); i++) {
      const uuid = randomUUID();
      await Promise.all([
        this.commonService.addAnalytics({ uuid }, jobOptions),
        this.commonService.addNotification(
          { uuid },
          { ...jobOptions, priority: 1 },
        ),
        this.commonService.addStore({ uuid }, jobOptions),
        this.commonService.addTrade({ uuid }, jobOptions),
      ]);
      this.logger.log(`Trade ${uuid} created`);
    }
  }
}
