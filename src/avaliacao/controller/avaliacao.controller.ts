import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, HttpStatus, Put, Query, ParseIntPipe } from '@nestjs/common';
import { AvaliacaoService } from '../service/avaliacao.service';
import { CreateAvaliacaoDto } from '../dto/create-avaliacao.dto';
import { UpdateAvaliacaoDto } from '../dto/update-avaliacao.dto';
import { ApiTags } from '@nestjs/swagger';
import { Role } from 'src/usuario/Enum/role-enum';
import { Roles } from 'src/auth/decorator/roles.decorator';

@Controller('avaliacoes')
@ApiTags('avaliacoes')
export class AvaliacaoController {
  constructor(private readonly avaliacaoService: AvaliacaoService) {}

  @Post()
  public async create(@Body() createAvaliacaoDto: CreateAvaliacaoDto) {
    return await this.avaliacaoService.create(createAvaliacaoDto);
  }

  @Get()
  public async findAll(@Query('idLoja') idLoja: number) {
      return await this.avaliacaoService.findAll(idLoja);
  }

  @Get(':id')
  public async findById(@Param('id') id: string) {
    return await this.avaliacaoService.findById(id);
  }

  @Put(':id')
  public async update(@Param('id') id: string, @Body() updateAvaliacaoDto: UpdateAvaliacaoDto) {
    return await this.avaliacaoService.update(+id, updateAvaliacaoDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @Roles(Role.ADMIN)
  public async remove(@Param('id') id: string) {
    await this.avaliacaoService.remove(+id);
  }
}
