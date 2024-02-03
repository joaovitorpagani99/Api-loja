import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { PagamentoService } from '../service/pagamento.service';
import { CreatePagamentoDto } from '../dto/create-pagamento.dto';
import { UpdatePagamentoDto } from '../dto/update-pagamento.dto';
import { ApiTags } from '@nestjs/swagger';

@Controller('pagamento')
@ApiTags('pagamento')
export class PagamentoController {
  constructor(private readonly pagamentoService: PagamentoService) { }

  @Post()
  public async create() {
    return await this.pagamentoService.create();
  }


}
