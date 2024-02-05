import { Controller, Get, Post, Body, Patch, Param, Delete, Req } from '@nestjs/common';
import { PagamentoService } from '../service/pagamento.service';
import { CreatePagamentoDto } from '../dto/create-pagamento.dto';
import { UpdatePagamentoDto } from '../dto/update-pagamento.dto';
import { ApiTags } from '@nestjs/swagger';
import { IsPublic } from 'src/auth/decorator/is-public.decorator';

@Controller('pagamento')
@ApiTags('pagamento')
export class PagamentoController {
  constructor(private readonly pagamentoService: PagamentoService) { }

  @Post()
  public async create(@Body() createPagamentoDto: CreatePagamentoDto) {
    return await this.pagamentoService.create(createPagamentoDto);
  }

  @Post('verificaPagamento')
  @IsPublic()
  public async findAll(@Req() req) {
    console.log(req);
    
  }


}
