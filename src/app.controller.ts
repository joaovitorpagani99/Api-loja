import { Controller, Get } from '@nestjs/common';
import { IsPublic } from './auth/decorator/is-public.decorator';

@Controller()
export class AppController {

  @Get()
  @IsPublic()
  getHello(): string {
    return 'Api de ecommerce, desenvolvida por João Vitor Pagani';
  }
}
