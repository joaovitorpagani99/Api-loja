import { PartialType } from '@nestjs/swagger';
import { CreatePagamentoDto } from './create-pagamento.dto';

export class UpdatePagamentoDto extends PartialType(CreatePagamentoDto) {}
