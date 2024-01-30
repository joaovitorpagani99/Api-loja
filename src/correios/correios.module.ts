import { Module } from '@nestjs/common';
import { CorreiosService } from './service/correios.service';
import { CorreiosController } from './controller/correios.controller';
import { HttpModule } from '@nestjs/axios';
import { SoapModule } from 'nestjs-soap';

const CHAVE_CEP_API = process.env.CHAVE_CEPCERTO;
@Module({
  imports: [
    HttpModule.register({
      timeout: 8000,
      maxRedirects: 5,
    }),
  ],
  controllers: [CorreiosController],
  providers: [CorreiosService],
  exports: [CorreiosService],
})
export class CorreiosModule { }
