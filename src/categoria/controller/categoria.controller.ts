import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';
import { CreateCategoriaDto } from '../dto/create-categoria.dto';
import { CategoriaService } from '../service/categoria.service';
import { UpdateCategoriaDto } from '../dto/update-categoria.dto';
import { Roles } from 'src/auth/decorator/roles.decorator';
import { Role } from 'src/usuario/Enum/role-enum';
import { ApiTags } from '@nestjs/swagger';


@Controller('categoria')
@ApiTags('categoria')
export class CategoriaController {
  constructor(private readonly categoriaService: CategoriaService) { }

  @Post()
  @Roles(Role.ADMIN)
  public async create(@Body() createCategoriaDto: CreateCategoriaDto) {
    return this.categoriaService.create(createCategoriaDto);
  }

  @Get()
  public async findAll(@Query('loja') loja: string) {
    return this.categoriaService.findAll(loja);
  }

  @Get('disponiveis')
  public async findDisponiveis(@Query('loja') loja: string) {
    return this.categoriaService.getCategoriasDisponivel(loja);
  }

  @Get(':id')
  public async findById(@Query('loja') loja: string, @Param('id') id: string) {
    return this.categoriaService.findById(loja, +id);
  }

  @Put(':id')
  @Roles(Role.ADMIN)
  public async update(@Param('id') id: string,
    @Body() updateCategoriaDto: UpdateCategoriaDto) {
    return this.categoriaService.update(+id, updateCategoriaDto);
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  public async remove(@Param('id') id: string) {
    return this.categoriaService.remove(+id);
  }

  /*@Get(':id/produtos')
  public async showProdutos(@Param('id') id: string, @Query('offset') offset: number, @Query('limit') limit: number) {
    return this.categoriaService.(id, offset, limit);
  }

  @Put(':id/produtos')
  public async updateProdutos(@Param('id') id: string, @Body('produtos') produtos: string[]) {
    return this.categoriaService.updateProdutos(id, produtos);
  }*/
}