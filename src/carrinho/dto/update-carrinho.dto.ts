import { PartialType } from '@nestjs/swagger';
import { CreateCarrinhoDto } from './create-carrinho.dto';

export class UpdateCarrinhoDto extends PartialType(CreateCarrinhoDto) {}
