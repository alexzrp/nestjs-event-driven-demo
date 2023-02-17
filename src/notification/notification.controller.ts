import { Controller, Sse } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';

@Controller('notification')
export class NotificationController {
  constructor(
    @InjectPinoLogger(NotificationController.name)
    private readonly logger: PinoLogger,
    private notificationService: NotificationService,
  ) {}

  @Sse('sse')
  sse() {
    this.logger.info('Logged in SSE');
    return this.notificationService.subscribe();
  }
}
