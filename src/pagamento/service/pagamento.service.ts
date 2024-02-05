import { Injectable } from '@nestjs/common';
import { CreatePagamentoDto } from '../dto/create-pagamento.dto';
import * as mercadopago from 'mercadopago';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Pagamento } from '../entities/pagamento.entity';
import { PedidoService } from 'src/pedido/service/pedido.service';
import { LojaService } from 'src/loja/service/loja.service';
import { Pedido } from 'src/pedido/entities/pedido.entity';
import { Loja } from 'src/loja/entities/loja.entity';

@Injectable()
export class PagamentoService {
  private mercadoPago;

  constructor(
    @InjectRepository(Pagamento)
    private pagamentoRepository: Repository<Pagamento>,
    private readonly pedidoService: PedidoService,
    private readonly lojaService: LojaService,
  ) {
    this.mercadoPago = new mercadopago.MercadoPagoConfig({
      accessToken: process.env.MP_ACCESS_TOKEN,
    });
  }

  async create(createPagamentoDto: CreatePagamentoDto) {
    const pedido = await this.pedidoService.findById(createPagamentoDto.idPedido.toString(),);
    const loja = await this.lojaService.findById(createPagamentoDto.idLoja);
    return await this.realizarPagamento(pedido, loja);
  }

  async realizarPagamento(pedido: Pedido, loja: Loja) {
    try {
      const preference = new mercadopago.Preference(this.mercadoPago);
      const response = await preference.create({
        body: {
          items: [
            {
              id: pedido.carrinho.id.toString(),
              category_id: loja.categorias[0].id.toString(),
              title: loja.nome,
              quantity: pedido.carrinho.quantidade,
              unit_price: pedido.carrinho.precoUnitario,
            },
          ],
        },
      });
      const { id, sandbox_init_point, init_point } = response;
      const pagamento = new Pagamento({
        valor: pedido.carrinho.precoUnitario,
        idCheckout: id,
        sandbox_init_point: sandbox_init_point,
        init_point: init_point,
        pedido,
        loja,
      });
      return pagamento;
    } catch (err) {
      throw new Error(err);
    }
  }
}
