import { Module } from '@nestjs/common';
import { PedidoService } from './service/pedido.service';
import { PedidoController } from './controller/pedido.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Pedido } from './entities/pedido.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Pedido]),
  ],
  controllers: [PedidoController],
  providers: [PedidoService],
})
export class PedidoModule {}
