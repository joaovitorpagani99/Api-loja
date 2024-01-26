import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateAvaliacaoDto } from '../dto/create-avaliacao.dto';
import { UpdateAvaliacaoDto } from '../dto/update-avaliacao.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Avaliacao } from '../entities/avaliacao.entity';
import { Repository } from 'typeorm';
import { LojaService } from 'src/loja/service/loja.service';
import { ProdutoService } from 'src/produto/service/produto.service';

@Injectable()
export class AvaliacaoService {

  constructor(
    @InjectRepository(Avaliacao) private avaliacaoRepository: Repository<Avaliacao>,
    private produtoService: ProdutoService
  ) { }

  async create(createAvaliacaoDto: CreateAvaliacaoDto) {
    const produto = await this.produtoService.findById(+createAvaliacaoDto.idProduto);

    if (!produto) {
      throw new BadRequestException('Produto não encontrado');
    }

    try {
      const avaliacao = this.avaliacaoRepository.create({
        ...createAvaliacaoDto,
        produto: produto
      });

      console.log(avaliacao);
      const savedAvaliacao = await this.avaliacaoRepository.save(avaliacao);

      return savedAvaliacao;
    } catch (error) {
      console.error(error);
      throw new BadRequestException('Erro ao salvar avaliação.');
    }
  }

  async findAll() {
    try {
      const avaliacoes = await this.avaliacaoRepository.find(
        {
          relations: ['produto', 'loja']
        }
      );
      console.log(avaliacoes);
      return avaliacoes;
    } catch (error) {
      throw new NotFoundException("Não tem avaliações para essa produto");
    }
  }

  async findById(idAvaliacao: string) {
    const avaliacao = await this.avaliacaoRepository.findOne({
      where: {
        id: +idAvaliacao
      },
      relations: ['produto']
    });
    if (!avaliacao) {
      throw new NotFoundException("Avaliação não encontrada");
    }
    return avaliacao;
  }

  async update(idLoja: number, updateAvaliacaoDto: UpdateAvaliacaoDto) {
    const avaliacao = await this.avaliacaoRepository.update(idLoja, updateAvaliacaoDto);
    if (avaliacao.affected === 0) {
      throw new NotFoundException("Avaliação não encontrada");
    }
    return this.findById(idLoja.toString());
  }

  async remove(idLoja: number) {
    const avaliacao = await this.avaliacaoRepository.delete(idLoja);
    if (avaliacao.affected === 0) {
      throw new NotFoundException("Avaliação não encontrada");
    }
  }
}
