import { IsBoolean, IsNumber, IsString, IsOptional, IsPositive } from 'class-validator';
import { Loja } from 'src/loja/entities/loja.entity';
import { Pedido } from 'src/pedido/entities/pedido.entity';

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

    @IsOptional()
    loja?: Loja;

    @IsOptional()
    pedido?: Pedido;
}