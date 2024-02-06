import { Controller, Get, Post, Body, Patch, Param, Delete, Query, Put } from '@nestjs/common';
import { EntregaService } from '../service/entrega.service';
import { CreateEntregaDto } from '../dto/create-entrega.dto';
import { UpdateEntregaDto } from '../dto/update-entrega.dto';
import { ApiTags } from '@nestjs/swagger';
import { Role } from 'src/usuario/Enum/role-enum';
import { Roles } from 'src/auth/decorator/roles.decorator';

@Controller('entrega')
@ApiTags('entrega')
export class EntregaController {
  constructor(private readonly entregaService: EntregaService) {}

  @Get(':cep')
  public async findByCep(@Param('cep')cep: string) {
    return await this.entregaService.findByCep(cep);
  }

  @Post()
  public async create(@Body() createEntregaDto: CreateEntregaDto) {
    return await this.entregaService.create(createEntregaDto);
  }

  @Get()
  @Roles(Role.ADMIN)
  public async findAll(@Query('idLoja')idLoja: string ) {
    return await this.entregaService.findAll(idLoja);
  }

  @Get(':id')
  @Roles(Role.ADMIN, Role.USER)
  public async findById(@Param('id') id: string) {
    return await this.entregaService.findByID(+id);
  }


  @Put(':id')
  @Roles(Role.ADMIN, Role.USER)
  public async update(@Param('id') id: string, @Body() updateEntregaDto: UpdateEntregaDto) {
    return await this.entregaService.update(+id, updateEntregaDto);
  }


}
