import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { CommonModule } from '../common/common.module';
import { NotificationModule } from '../notification/notification.module';
import { MonitorModule } from '../monitor/monitor.module';

@Module({
  imports: [CommonModule, NotificationModule, MonitorModule],
  controllers: [AppController],
})
export class AppModule {}
