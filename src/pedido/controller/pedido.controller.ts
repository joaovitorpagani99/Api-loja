import { Controller, Get, Post, Body, Param, Delete, Query, Request, HttpCode, Req } from '@nestjs/common';
import { PedidoService } from '../service/pedido.service';
import { CreatePedidoDto } from '../dto/create-pedido.dto';
import { ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/auth/decorator/roles.decorator';
import { Role } from 'src/usuario/Enum/role-enum';

@Controller('pedido')
@ApiTags('pedido')
export class PedidoController {
  constructor(private readonly pedidoService: PedidoService) { }


  @Post()
  public async create(@Body() createPedidoDto: CreatePedidoDto) {
    return await this.pedidoService.create(createPedidoDto);
  }

  @Get()
  @Roles(Role.ADMIN)
  public async findAll(@Query('idLoja') idLoja: string) {
    return await this.pedidoService.findAll(idLoja);
  }
  //pedido especifico de uma loja
  @Get('admin/:id')
  @Roles(Role.ADMIN)
  public async findById(@Param('idPedido') idPedido: string) {
    return await this.pedidoService.findById(idPedido);
  }

  @Delete('admin/:idPedido')
  @HttpCode(204)
  @Roles(Role.ADMIN)
  public async remove(@Param('idPedido') idPedido: string, @Body() mensagemCancelamento: string) {
    return await this.pedidoService.remove(idPedido, mensagemCancelamento);
  }

  @Get('cliente/:idCliente')
  @Roles(Role.ADMIN)
  public async todosOsPedidosCliente(@Param('idCliente') idCliente: string, @Query('idLoja') idLoja: string) {
    return await this.pedidoService.todosOsPedidosClienteADMIN(idCliente, idLoja);

  }

  @Get('cliente/:idPedido/carrinho')
  @Roles(Role.ADMIN)
  public async pedidoDeUmCarrinho(@Param('idPedido') idPedido: string, @Query('idLoja') idLoja: string) {
    return await this.pedidoService.pedidoDeUmCarrinho(+idLoja, idPedido);
  }



  //pegar um determinado pedido de um carrinho 
  @Get('carrinho/pedidoespecifico')
  public async findByCarrinho(@Req() req, @Query('idLoja') idLoja: string, @Query('idPedido') idPedido: string) {
    return await this.pedidoService.pegarUmPedidoEspecifico(req.user.email, idLoja, idPedido);
  }

  @Get('carrinho/findallPedidio')
  public async findAllCliente(@Req() req, @Query('idLoja') idLoja: string) {
    return await this.pedidoService.todosOsPedidosCliente(req.user.email, idLoja);
  }


  //remover um pedido de um carrinho
  @Delete(':idPedido')
  public async cancelarPedido(@Req() req, @Query('idPedido') idPedido: string, @Body() mensagemCancelamento: string) {
    return this.pedidoService.cancelarPedidoCliente(req.user.email, idPedido, mensagemCancelamento);
  }



}
