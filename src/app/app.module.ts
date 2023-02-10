import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { CommonModule } from '../common/common.module';
import { NotificationModule } from '../notification/notification.module';
import { MonitorModule } from '../monitor/monitor.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'static'),
      exclude: ['/api*'],
    }),
    CommonModule,
    NotificationModule,
    MonitorModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
