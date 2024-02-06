import { LojaService } from 'src/loja/service/loja.service';
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateEntregaDto } from '../dto/create-entrega.dto';
import { UpdateEntregaDto } from '../dto/update-entrega.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Entrega } from '../entities/entrega.entity';
import { Repository } from 'typeorm';
import { HttpService } from '@nestjs/axios';
import { ReturnCep } from '../dto/dto/return-cep.dto';
import { AxiosError } from 'axios';
import { TamanhoProdutoDto } from '../dto/dto/tamanho-produto.dto';

@Injectable()
export class EntregaService {
  URL_CORREIOS = process.env.CEP_API_URL;
  CEP_COMPANY = process.env.CEP_COMPANY;
  CHAVE_CEPCERTO = process.env.CHAVE_CEPCERTO;
  urlBase = process.env.URL_BASE_FRETE;

  constructor(
    @InjectRepository(Entrega)
    private readonly entregaRepository: Repository<Entrega>,
    private readonly lojaService: LojaService,
    private httpService: HttpService,

  ) { }


  public async create(createEntregaDto: CreateEntregaDto) {
    try {
      await this.entregaRepository.save(createEntregaDto);
      return createEntregaDto;
    } catch (error) {
      throw new BadRequestException('Erro ao criar entrega.')
    }
  }

  public async findAll(idLoja: string) {
    const loja = await this.lojaService.findById(+idLoja);
    const entregas = await this.entregaRepository.find({
      where: { loja: { id: loja.id } },
      relations: ['loja', 'usuario', 'entregador'],
    });
    if (entregas.length === 0) {
      throw new NotFoundException('Nenhuma entrega encontrada');
    }
    return entregas;
  }

  public async findByID(id: number) {
    try {
      const entrega = await this.entregaRepository.findOne({
        where: { id },
      });
      if (!entrega) throw new NotFoundException('Entrega não encontrada')

      return entrega;
    } catch (error) {
      throw new BadRequestException('Erro ao buscar entrega.')
    }
  }

  public async update(id: number, updateEntregaDto: UpdateEntregaDto) {
    const updateEntrega = await this.entregaRepository.update(id, updateEntregaDto);
    if (updateEntrega.affected === 0) {
      throw new NotFoundException('Entrega não encontrada');
    }
    return await this.entregaRepository.findOne({
      where: { id },
    });
  }



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
