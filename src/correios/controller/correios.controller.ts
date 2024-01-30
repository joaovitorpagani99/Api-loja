import { Controller, Get, Param} from '@nestjs/common';
import { CorreiosService } from '../service/correios.service';

@Controller('correios')
export class CorreiosController {
  
  constructor(private readonly correiosService: CorreiosService) {}

  @Get(':cep')
  public async findByCep(@Param('cep')cep: string) {
    return await this.correiosService.findByCep(cep);
  }

}
