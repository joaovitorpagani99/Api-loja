import { Controller, Get, Post, Render, Request } from '@nestjs/common';
import { IsPublic } from './auth/decorator/is-public.decorator';
import { AppService } from './app.service';

@Controller()
export class AppController {

  constructor(private readonly appService: AppService) {}
  
  @Get('email')
  @Render('form')
  exibirForm() {
    //
  }

  @Post('enviar-email')
  @IsPublic()
  enviarEmail(@Request() req) {
    return this.appService.enviarEmail(
      req.body.email,
      req.body.mensagem,
    );
  }


}
