import { Controller } from '@nestjs/common';
import { AsyncApiPub, AsyncApiSub } from 'nestjs-asyncapi';
import { TradeCreatedDto } from './dto/trade-created.dto';

@Controller('common')
export class CommonController {
  @AsyncApiPub({
    channel: 'default/analytics',
    message: {
      payload: TradeCreatedDto,
    },
  })
  pubAnalytics() {
    // code here
  }

  @AsyncApiSub({
    channel: 'default/analytics',
    message: {
      payload: TradeCreatedDto,
    },
  })
  subAnalytics() {
    // code here
  }
}
