import { PagamentoService } from './../../pagamento/service/pagamento.service';
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreatePedidoDto } from '../dto/create-pedido.dto';
import { UpdatePedidoDto } from '../dto/update-pedido.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Pedido } from '../entities/pedido.entity';
import { LojaService } from 'src/loja/service/loja.service';
import { EntregaService } from 'src/entrega/service/entrega.service';
import { CarrinhoService } from 'src/carrinho/service/carrinho.service';
import { ClientesService } from 'src/clientes/service/clientes.service';

@Injectable()
export class PedidoService {

  constructor(
    @InjectRepository(Pedido)
    private pedidoRepository: Repository<Pedido>,
    private lojaService: LojaService,
    private PagamentoService: PagamentoService,
    private entregaService: EntregaService,
    private carrinhoService: CarrinhoService,
    private clienteService: ClientesService,

  ) { }


  public async create(createPedidoDto: CreatePedidoDto) {
    const loja = await this.lojaService.findById(createPedidoDto.idLoja);
    const carrinho = await this.carrinhoService.findById(createPedidoDto.idCarrinho);
    const cliente = await this.clienteService.findById(createPedidoDto.idCliente.toString());

    try {
      const savedPedido = await this.pedidoRepository.save({
        ...createPedidoDto,
        loja: loja,
        carrinho: carrinho,
        cliente: cliente,
      });
      return savedPedido;
    } catch (error) {
      console.log(error);
      throw new BadRequestException(error.message);
    }
  }
  public async findAll(idLoja: string) {
    await this.pedidoRepository.findOne({
      where: { loja: { id: +idLoja } },
      relations: ['loja', 'pagamento', 'entrega', 'carrinho', 'cliente'],
    }).catch((err) => {
      throw new NotFoundException(err.message);
    });
  }

  public async findById(id: number, idLoja: string) {
    const pedido = await this.pedidoRepository.findOne({
      where: { id: id.toString(), loja: { id: +idLoja } },
      relations: ['loja', 'pagamento', 'entrega', 'carrinho', 'cliente'],
    }).catch((err) => {
      throw new BadRequestException(err.message);
    });
    if (!pedido) {
      throw new NotFoundException('Pedido não encontrado');
    }
  }

  public async update(id: number, updatePedidoDto: UpdatePedidoDto) {
    const updatePedido = await this.pedidoRepository.update(id, updatePedidoDto).catch(() => {
      throw new BadRequestException('Não foi possivel atualizar o pedido');
    });
    if (updatePedido.affected === 0) {
      throw new NotFoundException('Pedido não encontrado');
    }
  }

  public async remove(id: number) {
    const pedido = await this.pedidoRepository.findOne({
      where: { id: id.toString() },
      relations: ['loja', 'pagamento', 'entrega', 'carrinho', 'cliente'],
    }).catch((err) => {
      throw new BadRequestException(err.message);
    });
    if (!pedido) {
      throw new NotFoundException('Pedido não encontrado');
    }
    try {
      pedido.cancelado = true;
      await this.pedidoRepository.save(pedido);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }


  public async cancelarPedidoCliente(idPedido: number, idCliente: string) {
    const cliente = await this.clienteService.findById(idCliente);
    const pedido = await this.pedidoRepository.findOne({
      where: { id: idPedido.toString(), cliente: cliente },
      relations: ['loja', 'pagamento', 'entrega', 'carrinho', 'cliente'],
    }).catch((err) => {
      throw new BadRequestException(err.message);
    });
    if (!pedido) {
      throw new NotFoundException('Pedido não encontrado');
    }
    try {
      pedido.cancelado = true;
      await this.pedidoRepository.save(pedido);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  public async pedidoDeUmCarrinho(idLoja: number, idPedido: number) {
    const loja = await this.lojaService.findById(idLoja);
    const pedido = await this.pedidoRepository.findOne({
      where: { id: idPedido.toString(), loja: loja },
      relations: ['loja', 'pagamento', 'entrega', 'carrinho', 'cliente'],
    }).catch((err) => {
      throw new BadRequestException(err.message);
    });

    if (!pedido) {
      throw new NotFoundException('Pedido não encontrado');
    }
    return pedido;
  }

  public async todosOsPedidosClienteADMIN(idCliente: string, idLoja: string) {
    const cliente = await this.clienteService.findById(idCliente);
    const loja = await this.lojaService.findById(+idLoja);

    const findPedidosCliente = await this.pedidoRepository.find({
      where: { cliente: cliente, loja: loja },
      relations: ['loja', 'pagamento', 'entrega', 'carrinho', 'cliente'],
    }).catch((err) => {
      throw new BadRequestException(err.message);
    });
    if (!findPedidosCliente) {
      throw new NotFoundException('Pedido não encontrado');
    }
    return findPedidosCliente;
  }

  public async todosOsPedidosCliente(email: string, idLoja: string) {
    const cliente = await this.clienteService.findByEmail(email);
    const loja = await this.lojaService.findById(+idLoja);

    const findPedidosCliente = await this.pedidoRepository.find({
      where: { cliente: cliente, loja: loja },
      relations: ['loja', 'pagamento', 'entrega', 'carrinho', 'cliente'],
    }).catch((err) => {
      throw new BadRequestException(err.message);
    });
    if (!findPedidosCliente) {
      throw new NotFoundException('Pedido não encontrado');
    }
    return findPedidosCliente;
  }

  async pegarUmPedidoEspecifico(email: string, idLoja: string, idPedido: string) {
    const loja = await this.lojaService.findById(+idLoja);
    const cliente = await this.clienteService.findByEmail(email);
    const pedido = await this.pedidoRepository.findOne({
      where: { id: idPedido, loja: loja, cliente: cliente },
      relations: ['loja', 'pagamento', 'entrega', 'carrinho', 'cliente'],
    }).catch((err) => {
      throw new BadRequestException(err.message);
    });
    if (!pedido) {
      throw new NotFoundException('Pedido não encontrado');
    }
    return pedido;
  }
}
