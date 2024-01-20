import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from '../service/auth.service';
import { AuthRequest } from '../models/AuthRequest';
import { ApiTags } from '@nestjs/swagger';

@Controller('auth')
@ApiTags('usuario')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post("/login")
  @HttpCode(HttpStatus.OK)
  public async login(@Body() body: AuthRequest) {
    return await this.authService.signIn(body.username, body.senha);
  }

  @Post("/registar")
  public registrar() {
    return null;
  }
}
