import { CreateCarrinhoDto } from './../dto/create-carrinho.dto';
import { ClientesService } from './../../clientes/service/clientes.service';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UpdateCarrinhoDto } from '../dto/update-carrinho.dto';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Carrinho } from '../entities/carrinho.entity';
import { VariacoesService } from 'src/variacoes/service/variacoes.service';

@Injectable()
export class CarrinhoService {
  constructor(
    @InjectRepository(Carrinho)
    private carrinhoRepository: Repository<Carrinho>,
    private clientesService: ClientesService,
    private variacoesService: VariacoesService,
  ) {}

  public async create(createCarrinhoDto: CreateCarrinhoDto) {
    const cliente = await this.clientesService.findById(
      createCarrinhoDto.clienteId,
    );

    const variacao = await this.variacoesService.findById(
      createCarrinhoDto.variacaoId,
    );

    const carrinho = new Carrinho();
    carrinho.cliente = cliente;
    carrinho.variacoes = [variacao];
    carrinho.quantidade = createCarrinhoDto.quantidade;
    carrinho.precoUnitario = createCarrinhoDto.precoUnitario;
    return await this.carrinhoRepository.save(carrinho).catch((err) => {
      throw new BadRequestException(err.message);
    });
  }

  public async findAll(email: string): Promise<Carrinho[]> {
    try {
      //const cliente = await this.clientesService.findByEmail(email);

      return await this.carrinhoRepository
        .find({
          relations: ['cliente', 'variacoes'],
        })
        .then((carrinho) => {
          if (carrinho.length === 0) {
            throw new NotFoundException('Nenhum item no carrinho');
          }
          return carrinho;
        });
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  public async findById(id: number): Promise<Carrinho> {
    const carrinho = await this.carrinhoRepository.findOne({
      where: { id: id },
      relations: ['variacoes','pedido', 'cliente'],
    });

    if (!carrinho) {
      throw new NotFoundException('Item não encontrado');
    }
    return carrinho;
  }

  public async update(id: number, updateCarrinhoDto: UpdateCarrinhoDto) {
    const carrinho = await this.findById(id);
    if(updateCarrinhoDto.variacaoId){
      const variacao = await this.variacoesService.findById(updateCarrinhoDto.variacaoId);
      carrinho.variacoes.push(variacao);
      await this.carrinhoRepository.save(carrinho).catch((err) => {
        throw new BadRequestException(err.message);
      } );
    }else {
      await this.carrinhoRepository.update(id, updateCarrinhoDto).catch((err) => {
        throw new BadRequestException(err.message);
      });
    }
    return await this.findById(id);
  }

  public async remove(id: number) {
    const carrinho = await this.carrinhoRepository.delete(id);
    if (carrinho.affected === 0) {
      throw new NotFoundException('Item não encontrado');
    }
  }
}
