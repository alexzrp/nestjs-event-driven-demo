import { ApiProperty } from '@nestjs/swagger';

export class TradeCreatedDto {
  @ApiProperty()
  uuid: string;
}
