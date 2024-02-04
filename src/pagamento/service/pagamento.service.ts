import { Injectable } from '@nestjs/common';
import { CreatePagamentoDto } from '../dto/create-pagamento.dto';
import { UpdatePagamentoDto } from '../dto/update-pagamento.dto';
import * as mercadopago from 'mercadopago';

@Injectable()
export class PagamentoService {

  private mercadoPago;

  constructor() {
    this.mercadoPago = new mercadopago.MercadoPagoConfig({
      accessToken: process.env.MP_ACCESS_TOKEN,
    })
  }

  async realizarPagamento(dadosPagamento: any) {

    const preference = new mercadopago.Preference(this.mercadoPago);

    const response = await preference.create({
      body: {
        items: [
          {
            id: '1', // Add the 'id' property
            title: 'Meu produto',
            quantity: 1,
            unit_price: 25
          }
        ],
      }
    });

    return response;
  }

  async create() {
    return this.realizarPagamento({});
  }

  findAll() {
    return `This action returns all pagamento`;
  }

  findOne(id: number) {
    return `This action returns a #${id} pagamento`;
  }

  update(id: number, updatePagamentoDto: UpdatePagamentoDto) {
    return `This action updates a #${id} pagamento`;
  }

  remove(id: number) {
    return `This action removes a #${id} pagamento`;
  }
}
