import { IsNumber, IsOptional, IsString } from "class-validator";
import { UpdateDateColumn } from "typeorm";

export class CreateVariacoeDto {

    @IsOptional()
    @IsString()
    nome: string;
    
    @IsNumber()
    @IsOptional()
    preco: number;
    
    @IsNumber()
    @IsOptional()
    promocao: number;
    
    @IsOptional()
    fotos: string[];
    
    @IsString()
    @IsOptional()
    entrega: string;
    
    @IsNumber()
    idProduto: number;
}
