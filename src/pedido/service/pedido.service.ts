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
import { CarrinhoService } from 'src/carrinho/service/carrinho.service';
import { ClientesService } from 'src/clientes/service/clientes.service';
import { EntregaService } from 'src/entrega/service/entrega.service';
import { Variacoes } from 'src/variacoes/entities/variacoe.entity';
import { TamanhoProdutoDto } from 'src/entrega/dto/tamanho-produto.dto';
import { Entrega } from 'src/entrega/entities/entrega.entity';

@Injectable()
export class PedidoService {
  constructor(
    @InjectRepository(Pedido)
    private pedidoRepository: Repository<Pedido>,
    private lojaService: LojaService,
    private carrinhoService: CarrinhoService,
    private clienteService: ClientesService,
    private pagamentoService: PagamentoService,
    private entregaService: EntregaService,
  ) {}

  public async create(createPedidoDto: CreatePedidoDto, cep: string) {
    const loja = await this.lojaService.findById(createPedidoDto.lojaId);
    const carrinho = await this.carrinhoService.findById(
      createPedidoDto.carrinhoId,
    );
    const cliente = await this.clienteService.findById(
      createPedidoDto.clienteId,
    );

    let pedido = new Pedido({ loja, carrinho, cliente });
    const valorEntrega = await this.verificarEntregaCorreio(
      cep,
      carrinho.variacoes,
    );

    await this.pedidoRepository.save(pedido).catch((err) => {
      throw new BadRequestException(err.message);
    });

    const pagamento = await this.pagamentoService.realizarPagamento(
      pedido,
      loja,
      cep,
      valorEntrega.valorpac,
    );

    console.log(pagamento);

    const entrega = new Entrega({
      tipo: 'PAC',
      custo: pagamento.valor,
      dataPedido: pedido.createdAt,
      endereco: cliente.endereco,
      prazo: +valorEntrega.prazopac,
      pedido,
      loja,
    });

    console.log(entrega);

    await this.entregaService.salvar(entrega).catch((err) => {
      throw new BadRequestException(err.message);
    });

    return pagamento;
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

  public async findById(id: string): Promise<Pedido> {
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

  private async verificarEntregaCorreio(cep, variacoes: Variacoes[]) {
    if (!variacoes || !Array.isArray(variacoes)) {
      throw new Error('variacoes é undefined ou não é uma array');
    }
    let pesoTotal = 0;
    let comprimentoTotal = 0;
    let alturaTotal = 0;
    let larguraTotal = 0;

    variacoes.forEach(async (item) => {
      pesoTotal += item.pesoKg;
      comprimentoTotal += item.comprimento;
      alturaTotal += item.alturaCm;
      larguraTotal += item.larguraCm;
    });
    const tamanho = new TamanhoProdutoDto(
      pesoTotal,
      comprimentoTotal,
      larguraTotal,
      comprimentoTotal,
    );

    const valor = await this.entregaService.calcularPrecoPrazo(cep, tamanho);
    return valor;
  }
}
