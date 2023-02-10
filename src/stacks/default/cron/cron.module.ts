import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { CommonModule } from '../../../common/common.module';
import { CronService } from './cron.service';
import { CommonService } from '../../../common/common.service';

@Module({
  imports: [CommonModule, ScheduleModule.forRoot()],
  providers: [CronService, CommonService],
})
export class CronModule {}
