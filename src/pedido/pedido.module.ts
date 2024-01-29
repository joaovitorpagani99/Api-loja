import { Module } from '@nestjs/common';
import { PedidoService } from './service/pedido.service';
import { PedidoController } from './controller/pedido.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Pedido } from './entities/pedido.entity';
import { RegistroPedido } from './entities/registroPedido';
import { LojaModule } from 'src/loja/loja.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Pedido, RegistroPedido]),
    LojaModule,
  ],
  controllers: [PedidoController],
  providers: [PedidoService],
})
export class PedidoModule {}
