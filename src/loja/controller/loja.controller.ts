import { Controller, Get, Post, Body, Patch, Param, Delete, Put, HttpStatus, HttpCode } from '@nestjs/common';
import { LojaService } from '../service/loja.service';
import { CreateLojaDto } from '../dto/create-loja.dto';
import { UpdateLojaDto } from '../dto/update-loja.dto';
import { Role } from 'src/usuario/Enum/role-enum';
import { Roles } from 'src/auth/decorator/roles.decorator';
import { ApiTags } from '@nestjs/swagger';

@Controller('loja')
@ApiTags('auth')
export class LojaController {
  constructor(private readonly lojaService: LojaService) { }

  @Post()
  @Roles(Role.ADMIN)
  public async create(@Body() createLojaDto: CreateLojaDto) {
    return await this.lojaService.create(createLojaDto);
  }

  @Get()
  @Roles(Role.ADMIN)
  public async findById() {
    return await this.lojaService.findAll();
  }

  @Get(':id')
  @Roles(Role.ADMIN)
  public async findOne(@Param('id') id: string) {
    return await this.lojaService.findById(+id);
  }

  @Put(':id')
  @Roles(Role.ADMIN)
  public async update(@Param('id') id: string, @Body() updateLojaDto: UpdateLojaDto) {
    return await this.lojaService.update(+id, updateLojaDto);
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  @HttpCode(HttpStatus.NO_CONTENT)
  public async remove(@Param('id') id: string) {
    await this.lojaService.remove(+id);
  }


  @Get(':id/lojas')
  public async getLojasDoUsuario(@Param('id') id: string) {
    return await this.lojaService.getLojasDoUsuario(+id);
  }
}
