import { Controller, Get, Res, Sse } from '@nestjs/common';
import { Response } from 'express';
import { readFileSync } from 'fs';
import { join } from 'path';
import { interval, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Controller('notification')
export class NotificationController {
  constructor(private eventEmmiter: EventEmitter2) {}
  @Get()
  index(@Res() response: Response) {
    response
      .type('text/html')
      .send(readFileSync(join(__dirname, 'index.html')).toString());
  }

  @Sse('sse')
  sse(): Observable<MessageEvent> {
    let monitor;
    this.eventEmmiter.on('notification', (data) => {
      monitor = data;
    });
    console.log(monitor);
    return interval(1000).pipe(map((_) => ({ data: monitor } as MessageEvent)));
  }
}
