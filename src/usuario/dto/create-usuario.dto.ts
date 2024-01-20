import { IsEmail, IsString, Matches, MaxLength, MinLength } from "class-validator";

export class CreateUsuarioDto {

    @IsString()
    nome?: string;
    @IsEmail()
    email?: string;

    @IsString()
    @MinLength(4)
    @MaxLength(20)
    @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
      message: 'password too weak',
    })

    @IsString()
    senha?: string;
    
    idade?: Number;

    @IsString()
    loja?: string;

    @IsString()
    permissao?: string ;
}
