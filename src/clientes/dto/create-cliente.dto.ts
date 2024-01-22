import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsEnum, IsNumber, IsString, MaxLength, MinLength } from "class-validator";
import { Loja } from "src/loja/entities/loja.entity";
import { Role } from "src/usuario/Enum/role-enum";

export class CreateClienteDto {
    @ApiProperty()
    @IsString()
    nome?: string;
    
    @ApiProperty()
    @IsEmail()
    email?: string;
    
    @ApiProperty()
    @IsString()
    @MinLength(4)
    @MaxLength(20)
    //@Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    //  message: 'Senha muito fraca',
    //})
    @IsString()
    senha?: string;
    
    @ApiProperty()
    @IsNumber()
    idade?: Number;
    
    @ApiProperty()
    @IsString()
    endereco?: string;
    
    @ApiProperty()
    @IsEnum(Role)
    permissao?: Role;
    
    @ApiProperty()
    deletado?: boolean = false;

    @ApiProperty()
    lojas: Loja[];
}
