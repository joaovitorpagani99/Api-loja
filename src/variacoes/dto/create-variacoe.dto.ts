import { IsNumber, IsOptional, IsString } from "class-validator";
import { UpdateDateColumn } from "typeorm";

export class CreateVariacoeDto {

    @IsNumber()
    @IsOptional()
    id: number;
    
    @IsOptional()
    nome: string;
    
    @IsNumber()
    @IsOptional()
    preco: number;
    
    @IsNumber()
    @IsOptional()
    promocao: number;
    
    @IsString()
    @IsOptional()
    fotos: string[];
    
    @IsString()
    @IsOptional()
    entrega: string;
    
    @IsNumber()
    @IsOptional()
    idProduto: number;
}
