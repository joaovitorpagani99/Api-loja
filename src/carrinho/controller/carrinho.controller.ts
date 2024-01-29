import { Controller, Get, Post, Body, Param, Delete, Req, Put, Query, HttpCode } from '@nestjs/common';
import { CarrinhoService } from '../service/carrinho.service';
import { CreateCarrinhoDto } from '../dto/create-carrinho.dto';
import { UpdateCarrinhoDto } from '../dto/update-carrinho.dto';
import { Roles } from 'src/auth/decorator/roles.decorator';
import { Role } from 'src/usuario/Enum/role-enum';
import { RequestInt } from '../entities/request.interface';
import { Http } from 'winston/lib/winston/transports';

@Controller('carrinho')
export class CarrinhoController {
  constructor(private readonly carrinhoService: CarrinhoService) { }

  @Post()
  public async create(@Body() createCarrinhoDto: CreateCarrinhoDto) {
    return this.carrinhoService.create(createCarrinhoDto);
  }

  @Get()
  public async findAll(@Query('clientId') clientId: string) {
    return await this.carrinhoService.findAll(clientId);
  }

  @Get(':id')
  public async findById(@Param('id') id: string, @Query('clientId') clientId: string) {
    return await this.carrinhoService.findById(+id, clientId);
  }

  @Put(':id')
  public async update(@Param('id') id: string, @Body() updateCarrinhoDto: UpdateCarrinhoDto) {
    return await this.carrinhoService.update(+id, updateCarrinhoDto);
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  @HttpCode(204)
  public async remove(@Param('id') id: string) {
    await this.carrinhoService.remove(+id);
  }


}
