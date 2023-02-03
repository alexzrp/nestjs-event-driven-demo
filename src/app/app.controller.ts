import { Body, Controller, Get, Post } from '@nestjs/common';
import { AsyncApiPub, AsyncApiSub } from 'nestjs-asyncapi';
import { TradeCreatedDto } from '../common/dto/trade-created.dto';

@Controller('app')
export class AppController {
  @AsyncApiPub({
    channel: 'default/analytics',
    message: {
      payload: TradeCreatedDto,
    },
  })
  @Post()
  pubAnalytics(@Body() tradeCreate: TradeCreatedDto) {
    // code here
  }

  @AsyncApiSub({
    channel: 'default/analytics',
    message: {
      payload: TradeCreatedDto,
    },
  })
  @Get()
  subAnalytics(): TradeCreatedDto {
    return new TradeCreatedDto();
  }
}
