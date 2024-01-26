import { Module } from '@nestjs/common';
import { VariacoesService } from './service/variacoes.service';
import { VariacoesController } from './controller/variacoes.controller';
import { Variacoes } from './entities/variacoe.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProdutoModule } from 'src/produto/produto.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Variacoes]),
    ProdutoModule
  ] ,
  controllers: [VariacoesController],
  providers: [VariacoesService],
})
export class VariacoesModule {}
