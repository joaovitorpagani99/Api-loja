import { IsBoolean, IsNumber, IsString } from "class-validator";

export class CreateCategoriaDto {
    
    @IsString()
    nome: string;

    @IsString()
    codigo: string;

    @IsBoolean()
    disponibilidade: boolean;

    @IsNumber()
    idLoja: number;
}
