import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsString } from "class-validator";
import { Usuario } from "src/usuario/entities/usuario.entity";

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

    @ApiProperty()
    usuario?: Usuario;
}
