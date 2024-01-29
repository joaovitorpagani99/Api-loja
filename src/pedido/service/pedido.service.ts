import { Injectable } from '@nestjs/common';
import { CreatePedidoDto } from '../dto/create-pedido.dto';
import { UpdatePedidoDto } from '../dto/update-pedido.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Pedido } from '../entities/pedido.entity';
import { LojaService } from 'src/loja/service/loja.service';

@Injectable()
export class PedidoService {
  constructor(
    @InjectRepository(Pedido)
    private pedidoRepository: Repository<Pedido>,
    private lojaService: LojaService,
  ) { }

  
  public async create(createPedidoDto: CreatePedidoDto) {
    return 'This action adds a new pedido';
  }

  public async findAll(idLoja: string) {
    return `This action returns all pedido`;
  }

  public async findById(id: number, idLoja: string) {
    return `This action returns a #${id} pedido`;
  }

  public async update(id: number, updatePedidoDto: UpdatePedidoDto) {
    return `This action updates a #${id} pedido`;
  }

  public async remove(id: number, idLoja: string) {
    return `This action removes a #${id} pedido`;
  }


  public async cancelarPedidoCliente(idPedido: number, idCliente: string) {
    return 'This action adds a new pedido';
  }

  public async pedidoDeUmCarrinho(idLoja: number, idPedido: number) {
    return 'This action adds a new pedido';
  }

  public async findByCarrinho(idCliente: number, idLoja: string) {
    return 'This action adds a new pedido';
  }
  
  public async todosOsPedidosCliente(id: string, idLoja: string) {
    return 'This action adds a new pedido';
  }
}
