import { Controller, Get, Post, Body, Patch, Param, Delete, Put, HttpStatus, HttpCode } from '@nestjs/common';
import { ProdutoService } from '../service/produto.service';
import { CreateProdutoDto } from '../dto/create-produto.dto';
import { UpdateProdutoDto } from '../dto/update-produto.dto';
import { ApiTags } from '@nestjs/swagger';
import { Role } from 'src/usuario/Enum/role-enum';
import { Roles } from 'src/auth/decorator/roles.decorator';

@Controller('produto')
@ApiTags('produto')
export class ProdutoController {
  constructor(private readonly produtoService: ProdutoService) { }

  @Get('/loja/:idLoja')
  public async findAll(@Param('idLoja') idLoja: string) {
    return this.produtoService.findAll(idLoja);
  }

  @Get(':id/')
  public async findById(@Param('id') id: string) {
    return this.produtoService.findById(+id);
  }

  @Get('disponiveis/:idLoja')
  public async findByDisponivel(@Param('idLoja') idLoja: string,) {
    return this.produtoService.findByDisponiveis(+idLoja);
  }


  @Get('search/:search')
  public async findByCategoria(@Param('search') search: string) {
    return this.produtoService.findByPesquisa(search);
  }

  @Get('/:idVariacoes/variacooes')
  public async findVariacoes(@Param('idVariacoes') idVariacoes: string) {
    //return this.produtoService.findVariacoes(+idVariacoes);
  }

  @Post()
  @Roles(Role.ADMIN)
  public async create(@Body() createProdutoDto: CreateProdutoDto) {
    return this.produtoService.create(createProdutoDto);
  }


  @Put(':id')
  @Roles(Role.ADMIN)
  public async update(
    @Param('id') id: string,
    @Body() updateProdutoDto: UpdateProdutoDto) {
    return this.produtoService.update(+id, updateProdutoDto);
  }

  @Put('imagens/:id')
  @Roles(Role.ADMIN)
  public async uploadImagens(
    @Param('id') id: string,
    @Body() updateProdutoDto: UpdateProdutoDto) {
    return null;
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  @HttpCode(HttpStatus.NO_CONTENT)
  public async remove(@Param('id') id: string) {
    await this.produtoService.remove(+id);
  }
}
