import { IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class CreatePedidoDto {


    idPagamento?: number;


    idCliente?: number;
  

    idEntrega?: number;

    idLoja?: number;
    
    idCarrinho?: number;
}
