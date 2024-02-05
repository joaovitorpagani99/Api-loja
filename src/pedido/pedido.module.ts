import { Module, forwardRef } from '@nestjs/common';
import { PedidoService } from './service/pedido.service';
import { PedidoController } from './controller/pedido.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Pedido } from './entities/pedido.entity';
import { RegistroPedido } from './entities/registroPedido';
import { LojaModule } from 'src/loja/loja.module';
import { PagamentoModule } from 'src/pagamento/pagamento.module';
import { ClientesModule } from 'src/clientes/clientes.module';
import { EntregaModule } from 'src/entrega/entrega.module';
import { CarrinhoModule } from 'src/carrinho/carrinho.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Pedido, RegistroPedido]),
    LojaModule,
    forwardRef(() => PagamentoModule),
    ClientesModule,
    EntregaModule,
    CarrinhoModule,

  ],
  controllers: [PedidoController],
  providers: [PedidoService],
})
export class PedidoModule {}
