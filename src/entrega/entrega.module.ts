import { Module } from '@nestjs/common';
import { EntregaService } from './service/entrega.service';
import { EntregaController } from './controller/entrega.controller';
import { Entrega } from './entities/entrega.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LojaModule } from 'src/loja/loja.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Entrega]),
    LojaModule
  ] ,
  controllers: [EntregaController], 
  providers: [EntregaService],
  exports: [EntregaService]
})
export class EntregaModule {}
