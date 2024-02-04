import { CreateCarrinhoDto } from './../dto/create-carrinho.dto';
import { ClientesService } from './../../clientes/service/clientes.service';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UpdateCarrinhoDto } from '../dto/update-carrinho.dto';
import { In, Repository } from 'typeorm';
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
    carrinho.quantidade = createCarrinhoDto.quantidade;
    carrinho.precoUnitario = createCarrinhoDto.precoUnitario;
    console.log(carrinho);
      return await this.carrinhoRepository.save(carrinho)
      .catch((err) => {
        throw new BadRequestException(err.message);
      });
  }

  public async findAll(email: string): Promise<Carrinho[]> {
    try {
      //const cliente = await this.clientesService.findByEmail(email);

      return await this.carrinhoRepository
        .find({
          relations: ['cliente'],
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
      where: { id },
      relations: ['cliente'],
    });
    if (!carrinho) {
      throw new NotFoundException('Item não encontrado');
    }
    return carrinho;
  }

  public async update(
    id: number,
    updateCarrinhoDto: UpdateCarrinhoDto,
    email: string,
  ) {
    const carrinhoAt = await this.carrinhoRepository.update(
      id,
      updateCarrinhoDto,
    );
    if (carrinhoAt.affected === 0) {
      throw new NotFoundException('Item não encontrado');
    }
    const carrinho = await this.carrinhoRepository.findOne({
      where: { id },
      relations: ['cliente', 'produto', 'variacao'],
    });
    return carrinho;
  }

  public async remove(id: number) {
    const carrinho = await this.carrinhoRepository.delete(id);
    if (carrinho.affected === 0) {
      throw new NotFoundException('Item não encontrado');
    }
  }
}
