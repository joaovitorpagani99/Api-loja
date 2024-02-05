import { Controller, Get, Post, Body, Param, Delete, HttpCode, Put, Query, UploadedFile, UseInterceptors, Request, Req, UploadedFiles } from '@nestjs/common';
import { VariacoesService } from '../service/variacoes.service';
import { CreateVariacoeDto } from '../dto/create-variacoe.dto';
import { UpdateVariacoeDto } from '../dto/update-variacoe.dto';
import { ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/auth/decorator/roles.decorator';
import { Role } from 'src/usuario/Enum/role-enum';
import multerConfig from 'src/config/multer-config';
import { FileFieldsInterceptor } from '@nestjs/platform-express';

@Controller('variacoes')
@ApiTags('variacoes')
export class VariacoesController {
  constructor(private readonly variacoesService: VariacoesService) { }

  @Roles(Role.ADMIN)
  @Post('imagens/upload')
  @UseInterceptors(FileFieldsInterceptor([{ name: 'arquivos' }], multerConfig))
  public async uploadDeVariasImagens(@Query('idVariacoes') idVariacoes: string, @UploadedFiles() files: { arquivos: Express.MulterS3.File[] }) {
    return await this.variacoesService.uploadImagens(+idVariacoes, files['arquivos']);
  }


  @Post()
  @Roles(Role.ADMIN)
  public async create(@Body() createVariacoeDto: CreateVariacoeDto) {
    return await this.variacoesService.create(createVariacoeDto);
  }

  @Get()
  public async findAll(@Query('idProduto') idProduto: string) {
    return await this.variacoesService.findAll(idProduto);
  }

  @Get(':id')
  public async findOne(@Param('id') id: string) {
    return await this.variacoesService.findById(+id);
  }

  @Put(':id')
  @Roles(Role.ADMIN)
  public async update(@Param('id') id: string, @Body() updateVariacoeDto: UpdateVariacoeDto) {
    return await this.variacoesService.update(+id, updateVariacoeDto);
  }

  @Delete(':id')
  @HttpCode(204)
  @Roles(Role.ADMIN)
  public async remove(@Param('id') id: string) {
     await this.variacoesService.remove(+id);
  }
}
