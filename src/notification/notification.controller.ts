import { Controller, Sse, Request } from '@nestjs/common';
import { NotificationService } from './notification.service';

@Controller('notification')
export class NotificationController {
  constructor(private notificationService: NotificationService) {}

  @Sse('sse')
  sse(@Request() req) {
    return this.notificationService.subscribe();
  }
}
