import { Module } from '@nestjs/common';
import { EntregaService } from './service/entrega.service';
import { EntregaController } from './controller/entrega.controller';
import { Entrega } from './entities/entrega.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forFeature([Entrega]),

  ] ,
  controllers: [EntregaController], 
  providers: [EntregaService],
})
export class EntregaModule {}
