import { Injectable } from '@nestjs/common';
import { CreatePagamentoDto } from '../dto/create-pagamento.dto';
import * as mercadopago from 'mercadopago';
import { Carrinho } from 'src/carrinho/entities/carrinho.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Pedido } from 'src/pedido/entities/pedido.entity';
import { Pagamento } from '../entities/pagamento.entity';
import { PedidoService } from 'src/pedido/service/pedido.service';
import { LojaService } from 'src/loja/service/loja.service';

@Injectable()
export class PagamentoService {
  private mercadoPago;

  constructor(
    @InjectRepository(Pagamento)
    private pagamentoRepository: Repository<Pagamento>,
    private readonly pedidoService: PedidoService,
    private readonly lojaService: LojaService
  ) {
    this.mercadoPago = new mercadopago.MercadoPagoConfig({
      accessToken: process.env.MP_ACCESS_TOKEN,
    });
  }

  async create(createPagamentoDto: CreatePagamentoDto) {
    const carrinho = createPagamentoDto;
    //return await this.realizarPagamento(carrinho);
  
  }

  async realizarPagamento(carrinho: Carrinho) {
    const preference = new mercadopago.Preference(this.mercadoPago);

    const response = await preference.create({
      body: {
        items: [
          {
            id: carrinho.id.toString(),
            title: carrinho.cliente.nome,
            quantity: carrinho.quantidade,
            unit_price: carrinho.precoUnitario * carrinho.quantidade,
          },
        ],
      },
    });

    return response;
  }
}
