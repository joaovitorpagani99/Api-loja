import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsEnum, IsNumber, IsOptional, IsString, Matches, MaxLength, MinLength } from "class-validator";
import {  Role  } from "../Enum/role-enum";
export class CreateUsuarioDto {

    @ApiProperty()
    @IsString()
    nome: string;
    
    @ApiProperty()
    @IsEmail()
    email: string;

    @ApiProperty()
    @IsString()
    @MinLength(4)
    @MaxLength(20)
    //@Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    //  message: 'Senha muito fraca',
    //})
    @IsString()
    senha: string;
    
    @ApiProperty()
    @IsNumber()
    idade: Number;

    @ApiProperty()
    @IsEnum(Role)
    @IsOptional()
    permissao: Role;
}
