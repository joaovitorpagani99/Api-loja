import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { EntregaService } from '../service/entrega.service';
import { CreateEntregaDto } from '../dto/create-entrega.dto';
import { UpdateEntregaDto } from '../dto/update-entrega.dto';
import { ApiTags } from '@nestjs/swagger';

@Controller('entrega')
@ApiTags('entrega')
export class EntregaController {
  constructor(private readonly entregaService: EntregaService) {}

  @Post()
  create(@Body() createEntregaDto: CreateEntregaDto) {
    return this.entregaService.create(createEntregaDto);
  }

  @Get()
  findAll() {
    return this.entregaService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.entregaService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateEntregaDto: UpdateEntregaDto) {
    return this.entregaService.update(+id, updateEntregaDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.entregaService.remove(+id);
  }
}
