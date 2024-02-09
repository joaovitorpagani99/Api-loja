import { Inject, Injectable, forwardRef } from '@nestjs/common';
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
    @Inject(forwardRef(() => PedidoService))
    private readonly pedidoService: PedidoService,
    private readonly lojaService: LojaService,
  ) {
    this.mercadoPago = new mercadopago.MercadoPagoConfig({
      accessToken: process.env.MP_ACCESS_TOKEN,
    });
  }


  async realizarPagamento(pedido: Pedido, loja: Loja, cep: string, valorFrete: string) {
    console.log(pedido, loja, cep, valorFrete);
    try {
      const preference = new mercadopago.Preference(this.mercadoPago);
      const response = await preference.create({
        body: {
          notification_url: process.env.MP_notification_url,
          items: [
            {
              id: pedido.carrinho.id.toString(),
              category_id: loja.categorias[0].id.toString(),
              title: loja.nome,
              quantity: pedido.carrinho.quantidade,
              unit_price: (pedido.carrinho.precoUnitario * pedido.carrinho.quantidade) + +valorFrete,
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
      const pagamentoSalvo = await this.pagamentoRepository.save(pagamento);
      return {
        idPagamento: pagamentoSalvo.id,
        efetuado: pagamentoSalvo.efetuado,
        valor: pagamentoSalvo.valor,
        idCheckout: pagamentoSalvo.idCheckout,
        sandbox_init_point: pagamentoSalvo.sandbox_init_point,
        init_point: pagamentoSalvo.init_point,
        produto: pagamentoSalvo.pedido.loja.produtos,
        variacao: pagamentoSalvo.pedido.carrinho,
        loja: pagamentoSalvo.loja,
        carrinho: pagamentoSalvo.pedido.carrinho
      };
    } catch (err) {
      throw new Error(err);
    }
  }

  public async buscarPagamento(id: string) {
    return null;
  }
}
