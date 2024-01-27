import { Controller, Get, Post, Body, Patch, Param, Delete, Put, Request, HttpCode } from '@nestjs/common';
import { UsuarioService } from '../service/usuario.service';
import { CreateUsuarioDto } from '../dto/create-usuario.dto';
import { UpdateUsuarioDto } from '../dto/update-usuario.dto';
import { ApiTags } from '@nestjs/swagger';
import { IsPublic } from 'src/auth/decorator/is-public.decorator';
import { Role } from '../Enum/role-enum';
import { Roles } from 'src/auth/decorator/roles.decorator';

@Controller('usuario')
@ApiTags('usuario')
export class UsuarioController {

  constructor(private readonly usuarioService: UsuarioService) { }

  @IsPublic()
  @Post()
  public create(@Body() createUsuarioDto: CreateUsuarioDto) {
    createUsuarioDto.permissao = Role.ADMIN;
    return this.usuarioService.create(createUsuarioDto);
  }

  @Get()
  public findAll() {
    return this.usuarioService.findAll();
  }

  @Get(':id')
  public findOne(@Param('id') id: string) {
    return this.usuarioService.findById(+id);
  }

  @Put(':id')
  public update(@Param('id') id: string, @Body() updateUsuarioDto: UpdateUsuarioDto) {
    return this.usuarioService.update(+id, updateUsuarioDto);
  }

  @Delete(':id')
  @HttpCode(204)
  public async remove(@Param('id') id: string) {
    await this.usuarioService.remove(+id);
  }

}
