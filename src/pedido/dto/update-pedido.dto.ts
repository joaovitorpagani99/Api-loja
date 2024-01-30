import { PartialType } from '@nestjs/swagger';
import { Pedido } from '../entities/pedido.entity';

export class UpdatePedidoDto extends PartialType(Pedido) {}
