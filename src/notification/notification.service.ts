import { Injectable } from '@nestjs/common';
import { fromEvent } from 'rxjs';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class NotificationService {
  constructor(private readonly emitter: EventEmitter2) {}

  subscribe() {
    return fromEvent(this.emitter, 'notification');
  }

  async emit(data) {
    this.emitter.emit('notification', { data });
  }
}
