import { Controller, Get, Post, Body, Patch, Param, Delete, Req, Query } from '@nestjs/common';
import { PagamentoService } from '../service/pagamento.service';
import { CreatePagamentoDto } from '../dto/create-pagamento.dto';
import { UpdatePagamentoDto } from '../dto/update-pagamento.dto';
import { ApiTags } from '@nestjs/swagger';
import { IsPublic } from 'src/auth/decorator/is-public.decorator';

@Controller('pagamento')
@ApiTags('pagamento')
export class PagamentoController {
  constructor(private readonly pagamentoService: PagamentoService) { }


  @Post('verificaPagamento')
  @IsPublic()
  public async findAll(@Req() req) {
    console.log(req);
  }

  @Get(':id')
  public async buscarPagamento(@Param('id') id: string){
    return await this.pagamentoService.buscarPagamento(id);
  }


}
