import { Module } from '@nestjs/common';
import { AvaliacaoService } from './service/avaliacao.service';
import { AvaliacaoController } from './controller/avaliacao.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Categoria } from 'src/categoria/entities/categoria.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Categoria])
  ],
  controllers: [AvaliacaoController],
  providers: [AvaliacaoService],
})
export class AvaliacaoModule {}
