import { Controller, Get, Post, Body, Patch, Param, Delete, Put } from '@nestjs/common';
import { PedidoService } from '../service/pedido.service';
import { CreatePedidoDto } from '../dto/create-pedido.dto';
import { UpdatePedidoDto } from '../dto/update-pedido.dto';
import { ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/auth/decorator/roles.decorator';
import { Role } from 'src/usuario/Enum/role-enum';

@Controller('pedido')
@ApiTags('pedido')
export class PedidoController {
  constructor(private readonly pedidoService: PedidoService) {}

  @Get()
  @Roles(Role.ADMIN)
  public async findAll() {
    return this.pedidoService.findAll();
  }

  @Get(':id')
  @Roles(Role.ADMIN)
  public async findById(@Param('id') id: string) {
    return this.pedidoService.findById(+id);
  }

  @Put(':id')
  public async update(@Param('id') id: string, @Body() updatePedidoDto: UpdatePedidoDto) {
    return this.pedidoService.update(+id, updatePedidoDto);
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  public async remove(@Param('id') id: string) {
    return this.pedidoService.remove(+id);
  }

  //essas rotas sao somente do USUARIO

  //pegar um determinado pedido de um carrinho 
  @Roles(Role.USER)
  @Get('carrinho/:id')
  public async findByCarrinho(@Param('id') id: string) {
    //return this.pedidoService.findByCarrinho(+id);
  }

  @Roles(Role.USER)
  @Get('/')
  public async findAllCliente(@Param('id') id: string) { //lisyar todos os pedidos do proprio cliente
    //return this.pedidoService.findByCarrinho(+id);
  }

  //pegar todos os pedidos de um determinado carrinho

  @Roles(Role.USER)
  @Get('/')
  public async findAllByCarrinho() {
    //return this.pedidoService.findAllByCarrinho();
  }

  //adicionar um pedido a um carrinho
  @Post()
  @Roles(Role.USER)
  public async create(@Body() createPedidoDto: CreatePedidoDto) {
    return this.pedidoService.create(createPedidoDto);
  }

  //remover um pedido de um carrinho
  @Delete(':id')
  @Roles(Role.USER)
  public async cancelarPedido(@Param('id') id: string) {
    return this.pedidoService.remove(+id);
  }


}
