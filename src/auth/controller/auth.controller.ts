import { Controller, Post, Body, HttpCode, HttpStatus, UseGuards, Get, Request } from '@nestjs/common';
import { AuthService } from '../service/auth.service';
import { AuthRequest } from '../models/AuthRequest';
import { ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '../guard/auth.guard';
import { IsPublic } from '../decorator/is-public.decorator';
import { CreateUsuarioDto } from 'src/usuario/dto/create-usuario.dto';
import { Role  } from 'src/usuario/Enum/role-enum';
import { UsuarioService } from 'src/usuario/service/usuario.service';
import { Roles } from '../decorator/roles.decorator';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(
    private  authService: AuthService,
    private  usuarioService: UsuarioService,
  ) { }

  

  @IsPublic()
  @Post("/login")
  @HttpCode(HttpStatus.OK)
  public async login(@Body() body: AuthRequest) {
    return await this.authService.signIn(body.username, body.senha);
  }

  @IsPublic()
  @Post('/admin')
  public create(@Body() createUsuarioDto: CreateUsuarioDto) {
    createUsuarioDto.permissao = Role .ADMIN;
    return this.usuarioService.create(createUsuarioDto);
  }

  //estudar recuperacao de senha por email, fazer funcionar
  /*
  @Post('recovery')
  @IsPublic()
  public createRecovery(@Request() req) {
    const { email } = req.body;
    console.log(email);
    if (!email) return { message: 'Email não informado' };
    return this.authService.createRecovery(email);
  }*/



  @UseGuards(AuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }
}
