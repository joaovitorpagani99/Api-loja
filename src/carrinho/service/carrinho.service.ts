import { ClientesService } from './../../clientes/service/clientes.service';
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateCarrinhoDto } from '../dto/create-carrinho.dto';
import { UpdateCarrinhoDto } from '../dto/update-carrinho.dto';
import { In, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ItemCarrinho } from '../entities/carrinho.entity';
import { VariacoesService } from 'src/variacoes/service/variacoes.service';
import { ProdutoService } from 'src/produto/service/produto.service';

@Injectable()
export class CarrinhoService {

  constructor(
    @InjectRepository(ItemCarrinho)
    private carrinhoRepository: Repository<ItemCarrinho>,
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

  public async findAll(clientId: string) {
    const carrinho = await this.carrinhoRepository.find({
      where: { cliente: { id: clientId } },
      relations: ['cliente', 'produto', 'variacao'],
    });
    if (carrinho.length === 0) {
      throw new NotFoundException('Nenhum item no carrinho');
    }
    return carrinho;
  }

  public async findById(id: number, clientId: string) {
    const carrinho = await this.carrinhoRepository.findOne({
      where: { id, cliente: { id: clientId } },
      relations: ['cliente', 'produto', 'variacao'],
    });
    if (!carrinho) {
      throw new NotFoundException('Item não encontrado');
    }
    return carrinho;
  }

  public async update(id: number, updateCarrinhoDto: UpdateCarrinhoDto) {
    await this.carrinhoRepository.update(id, updateCarrinhoDto).then(async (res) => {
      if (res.affected === 0) {
        throw new NotFoundException('Item não encontrado');
      }
      console.log(res);
      return await this.carrinhoRepository.findOne({where: {id}});
    }).catch((err) => {
      console.log(err);
      throw new BadRequestException(err.message);
    });
  }

  public async remove(id: number) {
    const carrinho = await this.carrinhoRepository.delete(id);
    if (carrinho.affected === 0) {
      throw new NotFoundException('Item não encontrado');
    }
  }
}
