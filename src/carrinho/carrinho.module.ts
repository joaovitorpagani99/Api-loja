import { Module } from '@nestjs/common';
import { CarrinhoService } from './service/carrinho.service';
import { CarrinhoController } from './controller/carrinho.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Carrinho } from './entities/carrinho.entity';
import { ClientesModule } from 'src/clientes/clientes.module';
import { ProdutoModule } from 'src/produto/produto.module';
import { VariacoesModule } from 'src/variacoes/variacoes.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Carrinho]),
    ClientesModule,
    ProdutoModule,
    VariacoesModule
  ],
  controllers: [CarrinhoController],
  providers: [CarrinhoService],
  exports: [CarrinhoService]
})
export class CarrinhoModule {}
