import { IsBoolean, IsNumber, IsString, IsOptional, IsPositive } from 'class-validator';

export class CreateProdutoDto {


    @IsString()
    titulo: string;

    @IsBoolean()
    disponibilidade: boolean;

    @IsString()
    descricao: string;

    @IsString()
    fotos: string;

    @IsNumber()
    @IsPositive()
    preco: number;

    @IsNumber()
    promocao: number;

    @IsString()
    sku: string;

    @IsNumber()
    categoriaId: number;

    @IsNumber()
    idLoja?: number;

}