import { IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class CreatePedidoDto {

    @IsNotEmpty()
    @IsString()
    @IsOptional()
    idCliente: string;
  
    @IsOptional()
    @IsString()
    idEntrega: string;
  
    @IsNotEmpty()
    @IsString()
    @IsOptional()
    idLoja: string;
    @IsOptional()
    idCarrinho: string;
}
