import { ClientesService } from './../../clientes/service/clientes.service';
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateCarrinhoDto } from '../dto/create-carrinho.dto';
import { UpdateCarrinhoDto } from '../dto/update-carrinho.dto';
import { In, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Carrinho } from '../entities/carrinho.entity';
import { VariacoesService } from 'src/variacoes/service/variacoes.service';
import { ProdutoService } from 'src/produto/service/produto.service';

@Injectable()
export class CarrinhoService {

  constructor(
    @InjectRepository(Carrinho)
    private carrinhoRepository: Repository<Carrinho>,
    private clientesService: ClientesService,
    private produtosService: ProdutoService,
    private variacoesService: VariacoesService
  ) { }



  public async create(createCarrinhoDto: CreateCarrinhoDto) {
    const cliente = await this.clientesService.findById(createCarrinhoDto.clienteId.toString());
    const produto = await this.produtosService.findById(createCarrinhoDto.produtoId);
    const variacao = await this.variacoesService.findById(createCarrinhoDto.variacaoId);
    try {
      const carrinho = await this.carrinhoRepository.save({
        ...createCarrinhoDto,
        cliente,
        produto,
        variacao
      });
      return carrinho;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  public async findAll(email: string) {
    const carrinho = await this.carrinhoRepository.find({
      where: { cliente: { email: email } },
      relations: ['cliente', 'produto', 'variacao'],
    });
    console.log(carrinho);
    if (carrinho.length === 0) {
      throw new NotFoundException('Nenhum item no carrinho');
    }
    return carrinho;
  }

  public async findById(id: number): Promise<Carrinho> {
    const carrinho = await this.carrinhoRepository.findOne({
      where: { id },
      relations: ['cliente', 'produto', 'variacao'],
    });
    if (!carrinho) {
      throw new NotFoundException('Item não encontrado');
    }
    return carrinho;
  }

  public async update(id: number, updateCarrinhoDto: UpdateCarrinhoDto, email: string) {
    const carrinhoAt = await this.carrinhoRepository.update(id, updateCarrinhoDto);
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
