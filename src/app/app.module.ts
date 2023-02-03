import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { CommonModule } from '../common/common.module';

@Module({
  imports: [CommonModule],
  controllers: [AppController],
})
export class AppModule {}
