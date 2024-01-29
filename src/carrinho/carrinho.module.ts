import { Module } from '@nestjs/common';
import { CarrinhoService } from './service/carrinho.service';
import { CarrinhoController } from './controller/carrinho.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ItemCarrinho } from './entities/carrinho.entity';
import { UsuarioModule } from 'src/usuario/usuario.module';
import { ClientesModule } from 'src/clientes/clientes.module';
import { ProdutoModule } from 'src/produto/produto.module';
import { VariacoesModule } from 'src/variacoes/variacoes.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([ItemCarrinho]),
    ClientesModule,
    ProdutoModule,
    VariacoesModule
  ],
  controllers: [CarrinhoController],
  providers: [CarrinhoService],
})
export class CarrinhoModule {}
