import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNumber, IsString, Matches, MaxLength, MinLength } from "class-validator";

export class CreateUsuarioDto {

    @ApiProperty()
    @IsString()
    nome?: string;
    @IsEmail()
    email?: string;

    @ApiProperty()
    @IsString()
    @MinLength(4)
    @MaxLength(20)
    @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
      message: 'password too weak',
    })

    @ApiProperty()
    @IsString()
    senha?: string;
    
    @ApiProperty()
    @IsNumber()
    idade?: Number;

    @ApiProperty()
    @IsString()
    loja?: string;

    @ApiProperty()
    @IsString()
    permissao?: string ;
}
