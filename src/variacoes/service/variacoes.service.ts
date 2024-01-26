import { BadRequestException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CreateVariacoeDto } from '../dto/create-variacoe.dto';
import { UpdateVariacoeDto } from '../dto/update-variacoe.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Variacoes } from '../entities/variacoe.entity';
import { Repository } from 'typeorm';
import { ProdutoService } from 'src/produto/service/produto.service';

@Injectable()
export class VariacoesService {

  constructor(
    @InjectRepository(Variacoes)
    private variacoesRepository: Repository<Variacoes>,
    private readonly produtoService: ProdutoService
  ) { }

  async create(createVariacoeDto: CreateVariacoeDto) {
    const produto = await this.produtoService.findById(createVariacoeDto.idProduto);
    if (!produto) {
      throw new NotFoundException('Produto não encontrado');
    }
    try {
      const variacoes = await this.variacoesRepository.save({
        ...createVariacoeDto,
        produto
      });
      const { produto: produtoVariacoes, ...variacoesSemProduto } = variacoes;
      return {
        ...variacoesSemProduto,
        produto: createVariacoeDto.idProduto
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }

  }

  async findAll() {
    const variacoes = await this.variacoesRepository.find(
      {
        relations: ['produto'],
      }
    );
    if (variacoes.length === 0) {
      throw new NotFoundException('Nenhuma variacao encontrada');
    }

    return variacoes;

  }

  async findById(id: number) {
    const variacao = await this.variacoesRepository.findOne({
      where: { id },
      relations: ['produto'],
    })
    if (!variacao) {
      throw new NotFoundException('Variação não encontrada');
    }
    return variacao;
  }

  async update(id: number, updateVariacoeDto: UpdateVariacoeDto) {
    const variacao = await this.findById(id);
    if (!variacao) {
      throw new NotFoundException('Variação não encontrada');
    }
    const produto = await this.produtoService.findById(updateVariacoeDto.idProduto);
    if (!produto) {
      throw new NotFoundException('Produto não encontrado');
    }
    console.log(updateVariacoeDto)
    console.log(produto);
    try {
      await this.variacoesRepository.update(id, {
        ...updateVariacoeDto,
        produto
      });
      return await this.findById(id);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async remove(id: number) {
    const variacao = await this.findById(id);
    if (!variacao) {
      throw new NotFoundException('Variação não encontrada');
    }
    try {
      await this.variacoesRepository.delete(id);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
