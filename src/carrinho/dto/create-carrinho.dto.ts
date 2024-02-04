import { IsNotEmpty, IsNumber, IsPositive } from "class-validator";

export class CreateCarrinhoDto {
    
    @IsNumber()
    @IsPositive()
    @IsNotEmpty()
    quantidade: number;

    @IsNumber()
    @IsPositive()
    @IsNotEmpty()
    precoUnitario: number;
    
    @IsNumber()
    @IsPositive()
    @IsNotEmpty()
    clienteId: number;
    
    @IsNumber()
    @IsPositive()
    @IsNotEmpty()
    variacaoId: number;
}
