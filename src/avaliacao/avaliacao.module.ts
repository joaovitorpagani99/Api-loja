import { Module } from '@nestjs/common';
import { AvaliacaoService } from './service/avaliacao.service';
import { AvaliacaoController } from './controller/avaliacao.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Avaliacao } from './entities/avaliacao.entity';
import { LojaModule } from 'src/loja/loja.module';
import { ProdutoModule } from 'src/produto/produto.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Avaliacao]),
    LojaModule,
    ProdutoModule
  ],
  controllers: [AvaliacaoController],
  providers: [AvaliacaoService],
})
export class AvaliacaoModule {}
