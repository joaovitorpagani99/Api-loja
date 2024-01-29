import { Module } from '@nestjs/common';
import { VariacoesService } from './service/variacoes.service';
import { VariacoesController } from './controller/variacoes.controller';
import { Variacoes } from './entities/variacoe.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProdutoModule } from 'src/produto/produto.module';
import { Imagem } from './entities/imagem.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Variacoes, Imagem]),
    ProdutoModule
  ] ,
  controllers: [VariacoesController],
  providers: [VariacoesService],
  exports: [VariacoesService]
})
export class VariacoesModule {}
