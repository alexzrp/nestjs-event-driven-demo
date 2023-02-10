import { Controller, Sse } from '@nestjs/common';
import { NotificationService } from './notification.service';

@Controller('notification')
export class NotificationController {
  constructor(private notificationService: NotificationService) {}

  @Sse('sse')
  sse() {
    return this.notificationService.subscribe();
  }
}
