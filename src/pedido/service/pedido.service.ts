import { PagamentoService } from './../../pagamento/service/pagamento.service';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreatePedidoDto } from '../dto/create-pedido.dto';
import { UpdatePedidoDto } from '../dto/update-pedido.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Pedido } from '../entities/pedido.entity';
import { LojaService } from 'src/loja/service/loja.service';
import { EntregaService } from 'src/entrega/service/entrega.service';
import { CarrinhoService } from 'src/carrinho/service/carrinho.service';
import { ClientesService } from 'src/clientes/service/clientes.service';
import * as PagSeguroModule from 'nestjs-pagseguro';
import axios from 'axios';
import { Carrinho } from 'src/carrinho/entities/carrinho.entity';
@Injectable()
export class PedidoService {
  private readonly apiUrl = 'https://sandbox.api.pagseguro.com/checkouts';
  private readonly accessToken = 'B882F38BDD9F4809AD044CBC72A98A7B';

  constructor(
    @InjectRepository(Pedido)
    private pedidoRepository: Repository<Pedido>,
    private lojaService: LojaService,
    private carrinhoService: CarrinhoService,
    private clienteService: ClientesService,
  ) {}

  public async create(createPedidoDto: CreatePedidoDto): Promise<Pedido> {
    const loja = await this.lojaService.findById(createPedidoDto.lojaId);
    const carrinho = await this.carrinhoService.findById(
      createPedidoDto.carrinhoId,
    );

    const cliente = await this.clienteService.findById(
      createPedidoDto.clienteId,
    );

    let pedido = new Pedido({
      loja,
      carrinho,
      cliente,
    });

    await this.pedidoRepository.save(pedido).catch((err) => {
      console.log(err);
      throw new BadRequestException(err.message);
    });

    /* const teste = await this.realizarPagamento(pedido.carrinho);
    if (!teste) {
      throw new BadRequestException('Erro ao realizar pagamento');
    }*/
    return pedido;
  }

  public async findAll(idLoja: string) {
    const loja = await this.lojaService.findById(+idLoja);
    const pedidos = await this.pedidoRepository
      .find({
        where: { loja: { id: loja.id } },
        relations: ['loja', 'pagamento', 'entrega', 'carrinho', 'cliente'],
      })
      .catch((err) => {
        throw new BadRequestException(err.message);
      });

    if (pedidos.length === 0) {
      throw new NotFoundException('Nenhum pedido encontrado');
    }
    return pedidos;
  }

  public async findById(id: string, idLoja: string): Promise<Pedido> {
    const loja = await this.lojaService.findById(+idLoja);

    const pedido = await this.pedidoRepository
      .findOne({
        where: { id: id, loja: { id: loja.id } },
        relations: ['loja', 'pagamento', 'entrega', 'carrinho', 'cliente'],
      })
      .catch((err) => {
        throw new BadRequestException(err.message);
      });
    if (!pedido) {
      throw new NotFoundException('Pedido não encontrado');
    }
    return pedido;
  }

  public async update(id: number, updatePedidoDto: UpdatePedidoDto) {
    const updatePedido = await this.pedidoRepository
      .update(id, updatePedidoDto)
      .catch(() => {
        throw new BadRequestException('Não foi possivel atualizar o pedido');
      });
    if (updatePedido.affected === 0) {
      throw new NotFoundException('Pedido não encontrado');
    }
  }

  public async remove(id: string, mensagemCancelamento: string) {
    const pedido = await this.pedidoRepository
      .findOne({
        where: { id: id },
        relations: ['loja', 'pagamento', 'entrega', 'carrinho', 'cliente'],
      })
      .catch((err) => {
        throw new BadRequestException(err.message);
      });
    if (!pedido) {
      throw new NotFoundException('Pedido não encontrado');
    }
    if (pedido.cancelado) {
      throw new BadRequestException('Pedido já cancelado');
    }
    try {
      pedido.mensagemCancelamento = mensagemCancelamento;
      pedido.cancelado = true;
      await this.pedidoRepository.save(pedido);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  public async cancelarPedidoCliente(
    email: string,
    idPedido: string,
    mensagemCancelamento: string,
  ) {
    const cliente = await this.clienteService.findByEmail(email);

    const pedido = await this.pedidoRepository
      .findOne({
        where: { id: idPedido, cliente: { id: cliente.id } },
        relations: ['loja', 'pagamento', 'entrega', 'carrinho', 'cliente'],
      })
      .catch((err) => {
        throw new BadRequestException(err.message);
      });
    if (!pedido) {
      throw new NotFoundException('Pedido não encontrado');
    }
    if (pedido.cancelado) {
      throw new BadRequestException('Pedido ja cancelado.');
    }
    try {
      pedido.mensagemCancelamento = mensagemCancelamento;
      pedido.cancelado = true;
      await this.pedidoRepository.save(pedido);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  public async pedidoDeUmCarrinho(idLoja: number, idPedido: string) {
    const loja = await this.lojaService.findById(idLoja);

    const pedido = await this.pedidoRepository
      .findOne({
        where: { id: idPedido, loja: { id: loja.id } },
        relations: ['loja', 'pagamento', 'entrega', 'carrinho', 'cliente'],
      })
      .catch((err) => {
        throw new BadRequestException(err.message);
      });

    if (!pedido) {
      throw new NotFoundException('Pedido não encontrado');
    }
    const carrinho = await this.carrinhoService.findById(pedido.carrinho.id);
    return carrinho;
  }

  public async todosOsPedidosClienteADMIN(
    idCliente: string,
    idLoja: string,
  ): Promise<Pedido[]> {
    const cliente = await this.clienteService.findById(+idCliente);
    const loja = await this.lojaService.findById(+idLoja);

    const findPedidosCliente = await this.pedidoRepository
      .find({
        where: { cliente: { id: cliente.id }, loja: { id: loja.id } },
        relations: ['loja', 'pagamento', 'entrega', 'carrinho', 'cliente'],
      })
      .catch((err) => {
        console.log(err);
        throw new BadRequestException(err.message);
      });
    if (!findPedidosCliente) {
      throw new NotFoundException('Pedido não encontrado');
    }
    return findPedidosCliente;
  }

  public async todosOsPedidosCliente(email: string, idLoja: string) {
    console.log(email, idLoja);
    const cliente = await this.clienteService.findByEmail(email);
    const loja = await this.lojaService.findById(+idLoja);

    const findPedidosCliente = await this.pedidoRepository
      .find({
        where: { cliente: { id: cliente.id }, loja: { id: loja.id } },
        relations: ['loja', 'pagamento', 'entrega', 'carrinho', 'cliente'],
      })
      .catch((err) => {
        throw new BadRequestException(err.message);
      });
    if (!findPedidosCliente) {
      throw new NotFoundException('Pedido não encontrado');
    }
    return findPedidosCliente;
  }

  async pegarUmPedidoEspecifico(
    email: string,
    idLoja: string,
    idPedido: string,
  ) {
    const loja = await this.lojaService.findById(+idLoja);

    const cliente = await this.clienteService.findByEmail(email);

    const pedido = await this.pedidoRepository
      .findOne({
        where: {
          id: idPedido,
          loja: { id: loja.id },
          cliente: { id: cliente.id },
        },
        relations: ['loja', 'pagamento', 'entrega', 'carrinho', 'cliente'],
      })
      .catch((err) => {
        throw new BadRequestException(err.message);
      });
    if (!pedido) {
      throw new NotFoundException('Pedido não encontrado');
    }
    return pedido;
  }

  async realizarPagamento(carrinho: any): Promise<any> {
    console.log(carrinho);
    const data = {
      customer: {
        name: carrinho[0].cliente.nome,
        email: carrinho[0].cliente.email,
        tax_id: carrinho[0].cliente.id,
      },
      reference_id: carrinho[0].id,
      items: [
        {
          reference_id: '123',
          name: carrinho[0].cliente.nome,
          quantity: carrinho[0].quantidade,
          unit_amount: carrinho[0].precoUnitario,
          description: carrinho[0].produto,
        },
      ],
    };

    try {
      const response = await axios.post(this.apiUrl, data, {
        headers: {
          Authorization: `Bearer ${this.accessToken}`,
          'Content-type': 'application/json',
          accept: 'application/json',
        },
      });

      return response.data;
    } catch (error) {
      throw new Error(`Erro ao realizar o pagamento: ${error.message}`);
    }
  }
}
