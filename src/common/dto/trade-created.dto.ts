import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';

export class TradeCreatedDto {
  @ApiProperty({ required: true, description: 'Trade identifier' })
  uuid: string;

  @ApiHideProperty()
  name: string;
}
