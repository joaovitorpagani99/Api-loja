import { TamanhoProdutoDto } from './../dto/tamanho-produto.dto';
import { BadRequestException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { AxiosError } from 'axios';
import { ReturnCep } from '../dto/return-cep.dto';

@Injectable()
export class CorreiosService {

  URL_CORREIOS = process.env.CEP_API_URL;
  CEP_COMPANY = process.env.CEP_COMPANY;
  CHAVE_CEPCERTO = process.env.CHAVE_CEPCERTO;
  urlBase = process.env.URL_BASE_FRETE;

  constructor(
    private httpService: HttpService,
  ) { }

  async findByCep(cep: string): Promise<ReturnCep> {
    if (!cep) {
      throw new BadRequestException('CEP is required');
    }
    const returnCep: ReturnCep = await this.httpService.axiosRef
      .get<ReturnCep>(this.URL_CORREIOS.replace('{CEP}', cep))
      .then((result) => {
        if (result.data.erro === 'true') {
          throw new NotFoundException('CEP not found');
        }
        return result.data;
      })
      .catch((error: AxiosError) => {
        throw new BadRequestException(
          `Error in connection request ${error.message}`,
        );
      });
    return returnCep;
  }

  async calcularPrecoPrazo(cep, tamanhoProduto: TamanhoProdutoDto): Promise<any> {
    const url = `${this.urlBase}/${this.CEP_COMPANY}/${cep}/${tamanhoProduto.peso}/${tamanhoProduto.altura}/${tamanhoProduto.largura}/${tamanhoProduto.comprimento}/${this.CHAVE_CEPCERTO}`;
    return this.httpService.axiosRef
      .get(url)
      .then((result) => {
        return result.data;
      })
      .catch((error: AxiosError) => {
        throw new BadRequestException(
          `Error in connection request ${error.message}`,
        );
      });
  }

}


