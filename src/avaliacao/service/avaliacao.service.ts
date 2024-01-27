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
    private produtoService: ProdutoService,
    private lojaService: LojaService
  ) { }

  async create(createAvaliacaoDto: CreateAvaliacaoDto): Promise<Avaliacao> {
    const produto = await this.produtoService.findById(+createAvaliacaoDto.idProduto);
    const loja = await this.lojaService.findById(+createAvaliacaoDto.idLoja);

    if (produto === null || produto === undefined) {
      throw new BadRequestException('Produto não encontrado');
    }

    try {
      const avaliacao = this.avaliacaoRepository.create({
        ...createAvaliacaoDto,
        produto: produto,
        loja: loja
      });

      const savedAvaliacao = await this.avaliacaoRepository.save(avaliacao);

      return savedAvaliacao;
    } catch (error) {
      console.error(error);
      throw new BadRequestException('Erro ao salvar avaliação.');
    }
  }

  async findAll(idLoja: number): Promise<Avaliacao[]> {
    const loja = await this.lojaService.findById(idLoja);
    try {
      const avaliacoes = await this.avaliacaoRepository.find(
        {
          where: { loja: { id: +idLoja } },
          relations: ['produto', 'loja']
        }
      );
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
      relations: ['produto','loja']
    });
    if (!avaliacao) {
      throw new NotFoundException("Avaliação não encontrada");
    }
    return avaliacao;
  }

  async update(idAvaliacao: number, updateAvaliacaoDto: UpdateAvaliacaoDto) {
    const avaliacao = await this.avaliacaoRepository.update(idAvaliacao, updateAvaliacaoDto);
    if (avaliacao.affected === 0) {
      throw new NotFoundException("Avaliação não encontrada");
    }
    return this.findById(idAvaliacao.toString());
  }

  async remove(idLoja: number) {
    const avaliacao = await this.avaliacaoRepository.delete(idLoja);
    if (avaliacao.affected === 0) {
      throw new NotFoundException("Avaliação não encontrada");
    }
  }
}
