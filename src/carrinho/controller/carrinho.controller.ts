import { Controller, Get, Post, Body, Param, Delete, Req, Put, Query, HttpCode } from '@nestjs/common';
import { CarrinhoService } from '../service/carrinho.service';
import { CreateCarrinhoDto } from '../dto/create-carrinho.dto';
import { UpdateCarrinhoDto } from '../dto/update-carrinho.dto';
import { Roles } from 'src/auth/decorator/roles.decorator';
import { Role } from 'src/usuario/Enum/role-enum';
import { RequestInt } from '../entities/request.interface';

@Controller('carrinho')
export class CarrinhoController {
  constructor(private readonly carrinhoService: CarrinhoService) { }

  @Post()
  public async create(@Body() createCarrinhoDto: CreateCarrinhoDto) {
    return this.carrinhoService.create(createCarrinhoDto);
  }

  @Get()
  public async findAll(@Req() req: RequestInt) {
    return await this.carrinhoService.findAll(req.user.email);
  }

  @Get(':id')
  public async findById(@Param('id') id: string, @Req() req: RequestInt) {
    return await this.carrinhoService.findById(+id);
  }

  @Put(':id')
  public async update(@Param('id') id: string, @Body() updateCarrinhoDto: UpdateCarrinhoDto, @Req() req: RequestInt){
    return await this.carrinhoService.update(+id, updateCarrinhoDto, req.user.email);
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  @HttpCode(204)
  public async remove(@Param('id') id: string) {
    await this.carrinhoService.remove(+id);
  }

}
