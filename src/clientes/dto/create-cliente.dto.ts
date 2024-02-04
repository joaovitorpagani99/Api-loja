import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsEmail, IsEnum, IsNumber, IsOptional, IsString, MaxLength, MinLength } from "class-validator";
import { Role } from "src/usuario/Enum/role-enum";

export class CreateClienteDto {
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
    @IsString()
    cpf: string;
    
    @ApiProperty()
    @IsNumber()
    idade: Number;
    
    @ApiProperty()
    @IsString()
    endereco: string;
    
    @ApiProperty()
    @IsEnum(Role)
    @IsOptional()
    permissao: Role;
    
    @ApiProperty()
    @IsOptional()
    @IsBoolean()
    ativo: boolean = false;

    @ApiProperty()
    @IsNumber()
    idLoja: number;
}
