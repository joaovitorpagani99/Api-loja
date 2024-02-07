import { IsNumber, IsOptional } from 'class-validator';

export class CreatePagamentoDto {

  @IsNumber()
  @IsOptional()
  idLoja: number;

  @IsNumber()
  @IsOptional()
  idPedido: number;
}
