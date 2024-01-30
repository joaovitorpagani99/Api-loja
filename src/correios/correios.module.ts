import { Module } from '@nestjs/common';
import { CorreiosService } from './service/correios.service';
import { CorreiosController } from './controller/correios.controller';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [
    HttpModule.register({
      timeout: 8000,
      maxRedirects: 5,
    }),
  ],
  controllers: [CorreiosController],
  providers: [CorreiosService],
})
export class CorreiosModule {}
