import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsString } from "class-validator";

export class CreateLojaDto {

    @ApiProperty()
    @IsString()
    nome?: string;

    @ApiProperty()
    @IsString()
    cnpj?: string;

    @ApiProperty()
    @IsEmail()
    email?: string;
    
    @ApiProperty()
    @IsString()
    telefone?: string;

    @ApiProperty()
    @IsString()
    endereco ?: string;
}
