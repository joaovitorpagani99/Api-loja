import { BadRequestException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CreateVariacoeDto } from '../dto/create-variacoe.dto';
import { UpdateVariacoeDto } from '../dto/update-variacoe.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Variacoes } from '../entities/variacoe.entity';
import { Repository } from 'typeorm';
import { ProdutoService } from 'src/produto/service/produto.service';
import { Imagem } from '../entities/imagem.entity';

@Injectable()
export class VariacoesService {
  constructor(
    @InjectRepository(Variacoes)
    private variacoesRepository: Repository<Variacoes>,

    @InjectRepository(Imagem)
    private readonly imagemRepository: Repository<Imagem>,

    private readonly produtoService: ProdutoService
  ) { }

  public async create(createVariacoeDto: CreateVariacoeDto) {
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

  public async findAll(idProduto: string): Promise<Variacoes[]> {
    const variacoes = await this.variacoesRepository.find(
      {
        where: { produto: { id: +idProduto } },
        relations: ['produto', 'imagens'],
      }
    );
    if (variacoes.length === 0) {
      throw new NotFoundException('Nenhuma variacao encontrada');
    }

    return variacoes;
  }

  async findById(id: number) {
    try {
      const variacao = await this.variacoesRepository.findOne({
        where: { id },
        relations: ['produto', 'imagens'],
      })
      if (!variacao) {
        throw new NotFoundException('Variação não encontrada');
      }
      return variacao;
    } catch (error) {
      if (error instanceof NotFoundException)
        throw error;

      throw new BadRequestException(error.message);
    }
  }

  public async update(id: number, updateVariacoeDto: UpdateVariacoeDto) {
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

  public async remove(id: number) {
    const variacao = await this.findById(id);
    console.log(variacao);

    try {
      await this.variacoesRepository.delete(id);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }


  public async uploadImagens(idVariacoes: number, files: Express.MulterS3.File[]) {
    if (!files || !Array.isArray(files)) {
      throw new Error('Files parameter is not defined or not an array.');
    }

    try {
      const variacaoProduto = await this.findById(idVariacoes);

      const imagens = files.forEach(async (file) => {
        await this.imagemRepository.save({
          url: file.location,
          variacoes: variacaoProduto,
        });
      });

      return 'Imagens salvas com sucesso';
    } catch (error) {
      console.log(error);
      throw new BadRequestException(error.message);
    }
  }

}