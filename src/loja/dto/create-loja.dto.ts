import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNumber, IsOptional, IsString } from "class-validator";

export class CreateLojaDto {

    @ApiProperty()
    @IsString()
    nome: string;

    @ApiProperty()
    @IsString()
    cnpj: string;

    @ApiProperty()
    @IsEmail()
    email: string;
    
    @ApiProperty()
    @IsString()
    @IsOptional()
    telefone?: string;

    @ApiProperty()
    @IsString()
    endereco: string;

    @ApiProperty()
    @IsNumber()
    idUsuario: number;
}
