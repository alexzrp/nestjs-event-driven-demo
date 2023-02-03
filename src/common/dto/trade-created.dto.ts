import { ApiProperty } from '@nestjs/swagger';

export class TradeCreatedDto {
  @ApiProperty({ required: true, description: 'Trade identifier' })
  uuid: string;
}
