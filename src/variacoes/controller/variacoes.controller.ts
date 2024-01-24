import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { VariacoesService } from '../service/variacoes.service';
import { CreateVariacoeDto } from '../dto/create-variacoe.dto';
import { UpdateVariacoeDto } from '../dto/update-variacoe.dto';
import { ApiTags } from '@nestjs/swagger';

@Controller('variacoes')
@ApiTags('variacoes')
export class VariacoesController {
  constructor(private readonly variacoesService: VariacoesService) {}

  @Post()
  create(@Body() createVariacoeDto: CreateVariacoeDto) {
    return this.variacoesService.create(createVariacoeDto);
  }

  @Get()
  findAll() {
    return this.variacoesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.variacoesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateVariacoeDto: UpdateVariacoeDto) {
    return this.variacoesService.update(+id, updateVariacoeDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.variacoesService.remove(+id);
  }
}
