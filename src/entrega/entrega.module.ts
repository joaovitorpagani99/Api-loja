import { Module } from '@nestjs/common';
import { EntregaService } from './service/entrega.service';
import { EntregaController } from './controller/entrega.controller';
import { Entrega } from './entities/entrega.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LojaModule } from 'src/loja/loja.module';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [
    HttpModule.register({
      timeout: 8000,
      maxRedirects: 5,
    }),
    TypeOrmModule.forFeature([Entrega]),
    LojaModule
  ] ,
  controllers: [EntregaController], 
  providers: [EntregaService],
  exports: [EntregaService]
})
export class EntregaModule {}
