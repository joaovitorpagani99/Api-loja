import { IsNumber, IsOptional } from 'class-validator';

export class CreatePagamentoDto {
  @IsNumber()
  @IsOptional()
  quantidade: number;

  @IsNumber()
  @IsOptional()
  precoUnitario: number;

  @IsNumber()
  @IsOptional()
  idLoja: number;

  @IsNumber()
  @IsOptional()
  idPedido: number;
}
