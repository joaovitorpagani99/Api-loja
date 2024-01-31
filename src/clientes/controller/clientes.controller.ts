import { Controller, Get, Post, Body, Patch, Param, Delete, Put } from '@nestjs/common';
import { ClientesService } from '../service/clientes.service';
import { CreateClienteDto } from '../dto/create-cliente.dto';
import { UpdateClienteDto } from '../dto/update-cliente.dto';
import { Role } from 'src/usuario/Enum/role-enum';
import { Roles } from 'src/auth/decorator/roles.decorator';
import { ApiTags } from '@nestjs/swagger';
import { IsPublic } from 'src/auth/decorator/is-public.decorator';

@Controller('clientes')
@ApiTags('clientes')
export class ClientesController {

  constructor(private readonly clientesService: ClientesService) { }

  //ADMIN

  @Get()
  @Roles(Role.ADMIN)
  public async findAll() {
    return this.clientesService.findAll();
  }

  @Get(':search/pedidos')
  @Roles(Role.ADMIN)
  public async buscarPedidos(@Param('search') search: string) {
    return this.clientesService.buscarPedidos(search);
  }

  //retornar os dados de um pedido
  @Get('/buscar/:search')
  @Roles(Role.ADMIN)
  public async buscarClientesPorNome(@Param('search') search: string) {
    return this.clientesService.buscarClientesPorNome(search);
  }

  ///retornar os dados de um cliente
  @Get('/admin/:id')
  @Roles(Role.ADMIN)
  public async getCliente(@Param('id') id: string) {
    return this.clientesService.findById(+id);
  }

  //retornar todos os pedidos de um determinado cliente
  @Get('/admin/:id/:pedidos')
  @Roles(Role.ADMIN)
  public async getPedidosCliente(@Param('id') idCliente: string, @Param('pedidos') pedidos: string) {
    return this.clientesService.findPedidosClientes(+idCliente, +pedidos);
  }

  @Put('/admin/:id')
  @Roles(Role.ADMIN)
  public async updateCliente(@Param('id') id: string, @Body() updateClienteDto: UpdateClienteDto) {
    return this.clientesService.update(id, updateClienteDto);
  }


  //CLIENTE
  @Post()
  @IsPublic()
  public async create(@Body() createClienteDto: CreateClienteDto) {
    return await this.clientesService.create(createClienteDto);
  }


  @Get(':id')
  public async findOne(@Param('id') id: string) {
    return await this.clientesService.findById(+id);
  }

  @Put(':id')
  public async update(@Param('id') id: string, @Body() updateClienteDto: UpdateClienteDto) {
    return await this.clientesService.update(id, updateClienteDto);
  }

  @Delete(':id')
  public async remove(@Param('id') id: string) {
    return await this.clientesService.remove(id);
  }

}
