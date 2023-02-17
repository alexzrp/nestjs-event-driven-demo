import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { CommonModule } from '../common/common.module';
import { NotificationModule } from '../notification/notification.module';
import { MonitorModule } from '../monitor/monitor.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { LoggerModule } from 'nestjs-pino';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'static'),
      exclude: ['/api*'],
    }),
    LoggerModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        pinoHttp: {
          level: process.env.LOG_LEVEL || 'info',
          redact: configService.get<string[]>('logger.redacted.fields'),
          pinoPretty: {
            colorize: false,
            singleLine: true,
            levelFirst: false,
            translateTime: "yyyy-mm-dd'T'HH:MM:ss.l'Z'",
            messageFormat: '{req.headers.x-correlation-id} [{context}] {msg}',
            ignore: 'pid,hostname,context,req,res,responseTime',
            errorLikeObjectKeys: ['err', 'error'],
          },
        },
      }),
      inject: [ConfigService],
    }),
    CommonModule,
    NotificationModule,
    MonitorModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
