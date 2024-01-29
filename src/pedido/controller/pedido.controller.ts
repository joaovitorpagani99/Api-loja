import { Controller, Get, Post, Body, Patch, Param, Delete, Put, Query, Request } from '@nestjs/common';
import { PedidoService } from '../service/pedido.service';
import { CreatePedidoDto } from '../dto/create-pedido.dto';
import { UpdatePedidoDto } from '../dto/update-pedido.dto';
import { ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/auth/decorator/roles.decorator';
import { Role } from 'src/usuario/Enum/role-enum';

@Controller('pedido')
@ApiTags('pedido')
export class PedidoController {
  constructor(private readonly pedidoService: PedidoService) { }

  @Get()
  @Roles(Role.ADMIN)
  public async findAll(@Query('idLoja') idLoja: string) {
    return await this.pedidoService.findAll(idLoja);
  }
  //pedido especifico de uma loja
  @Get('admin/:id')
  @Roles(Role.ADMIN)
  public async findById(@Param('idPedido') idPedido: string, @Query('idLoja') idLoja: string) {
    return await this.pedidoService.findById(+idPedido, idLoja);
  }

  @Delete('admin/:idPedido')
  @Roles(Role.ADMIN)
  public async remove(@Param('idPedido') idPedido: string, @Query('idLoja') idLoja: string) {
    return await this.pedidoService.remove(+idPedido, idLoja);
  }



  @Get('cliente/:idCliente')
  @Roles(Role.ADMIN)
  public async todosOsPedidosCliente(@Query('idLoja') idLoja: string, @Param('idCliente') idCliente: string) {
    return await this.pedidoService.todosOsPedidosCliente(idCliente, idLoja);

  }

  @Get('cliente/:idPedido/carrinho')
  @Roles(Role.ADMIN)
  public async pedidoDeUmCarrinho(@Query('idLoja') idLoja: string, @Param('idPedido') idPedido: string) {
    return await this.pedidoService.pedidoDeUmCarrinho(+idLoja, +idPedido);
  }


  //essas rotas sao somente do USUARIO

  //adicionar um pedido a um carrinho
  @Post()
  public async create(@Body() createPedidoDto: CreatePedidoDto, @Request() req){
    return await this.pedidoService.create(createPedidoDto);
  }

  //pegar um determinado pedido de um carrinho 
  @Get('carrinho/')
  public async findByCarrinho(@Request() req,  @Query('idLoja') idLoja: string) {
    return await this.pedidoService.findByCarrinho(req.user, idLoja);
  }

  @Get()
  public async findAllCliente(@Request() req, @Query('idLoja') idLoja: string) { //lisyar todos os pedidos do proprio cliente
    return await this.pedidoService.findByCarrinho(req.user, idLoja);
  }

  //remover um pedido de um carrinho
  @Delete(':id')
  public async cancelarPedido(@Request() req, @Query('idCliente') idCliente: string){
    return this.pedidoService.cancelarPedidoCliente(req.user, idCliente);
  }

  @Put(':id')
  public async update(@Param('idPedido') idPedido: string, @Body() updatePedidoDto: UpdatePedidoDto) {
    return await this.pedidoService.update(+idPedido, updatePedidoDto);
  }


}
