import { IsBoolean, IsString } from "class-validator";
import { Loja } from "src/loja/entities/loja.entity";
import { Produto } from "src/produto/entities/produto.entity";

export class CreateCategoriaDto {
    
    @IsString()
    nome?: string;

    @IsString()
    codigo?: string;

    @IsBoolean()
    disponibilidade?: boolean;

    produtos?: Produto[];
    
    loja?: Loja;
}
