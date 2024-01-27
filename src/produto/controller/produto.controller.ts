import { Controller, Get, Post, Body, Patch, Param, Delete, Put, HttpStatus, HttpCode, Query } from '@nestjs/common';
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

  @Get(':id/avaliacoes')
  public async showAvaliacoes(@Param('id') id: string) {
    return await this.produtoService.findAvaliacoes(+id);
  }

  @Get(':id/variacoes')
  public async showVariacoes(@Param('id') id: string) {
    return await this.produtoService.findVariacoes(+id);
  }

  @Get()
  public async findAll(@Query('idLoja') idLoja: string) {
    return this.produtoService.findAll(idLoja);
  }

  @Get('/disponiveis/idLoja')
  public async findByDisponivel(@Query('idLoja') idLoja: string) {
    return await this.produtoService.findByDisponiveis(+idLoja);
  }


  @Get('search')
  public async findByCategoria(@Query('search') search: string) {
    return await this.produtoService.findByPesquisa(search);
  }


  @Get(':id')
  public async findById(@Param('id') id: string) {
    return await this.produtoService.findById(+id);
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
    return await this.produtoService.update(+id, updateProdutoDto);
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
