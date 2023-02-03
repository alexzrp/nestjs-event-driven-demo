import { ApiProperty } from '@nestjs/swagger';

export class MonitorDto {
  @ApiProperty()
  queue: string;

  @ApiProperty()
  jobs_waiting: number;

  @ApiProperty()
  jobs_completed: number;

  @ApiProperty()
  workers_count: number;
}
