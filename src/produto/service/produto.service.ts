import { TamanhoProdutoDto } from '../../entrega/dto/tamanho-produto.dto';
import { CategoriaService } from './../../categoria/service/categoria.service';
import { LojaService } from './../../loja/service/loja.service';
import { Loja } from 'src/loja/entities/loja.entity';
import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
  forwardRef,
} from '@nestjs/common';
import { CreateProdutoDto } from '../dto/create-produto.dto';
import { UpdateProdutoDto } from '../dto/update-produto.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Produto } from '../entities/produto.entity';
import { Like, Repository } from 'typeorm';
import { EntregaService } from 'src/entrega/service/entrega.service';

@Injectable()
export class ProdutoService {
  constructor(
    @InjectRepository(Produto)
    private readonly produtoRepository: Repository<Produto>,
    private readonly lojaService: LojaService,
    private readonly CategoriaService: CategoriaService,
    private readonly entregaService: EntregaService,
  ) {}

  public async findPrecoCorreio(idProduto: number, cep: string) {
    const produto = await this.findById(idProduto);
    const tamanhoProduto = new TamanhoProdutoDto(
      produto.variacoes[0].pesoKg,
      produto.variacoes[0].comprimento,
      produto.variacoes[0].alturaCm,
      produto.variacoes[0].larguraCm,
    );
    const returnCorreio = await this.entregaService.calcularPrecoPrazo(
      cep,
      tamanhoProduto,
    );
    return returnCorreio;
  }

  async create(createProdutoDto: CreateProdutoDto) {
    const loja = await this.lojaService.findById(createProdutoDto.idLoja);
    const categoria = await this.CategoriaService.findById(
      createProdutoDto.idLoja.toString(),
      createProdutoDto.categoriaId,
    );

    try {
      const produto = await this.produtoRepository.save({
        ...createProdutoDto,
        loja,
        categoria,
      });

      const { loja: _, categoria: __, ...produtoSemLojaECategoria } = produto;
      return produtoSemLojaECategoria;
    } catch (error) {
      throw new BadRequestException('Erro ao salvar produto.');
    }
  }

  async findAll(idLoja: string): Promise<Produto[]> {
    const loja: Loja = await this.lojaService.findById(+idLoja);

    if (loja == null) {
      throw new NotFoundException('Nenhum loja com esse id.');
    }

    const produtos = await this.produtoRepository.find({
      relations: ['categoria', 'loja', 'variacoes', 'avaliacoes'],
    });

    if (produtos.length === 0) {
      throw new NotFoundException('Nenhum produto cadastrado nessa loja.');
    }

    return produtos;
  }
  async findById(id: number) {
    try {
      const produto = await this.produtoRepository.findOne({
        where: { id },
        relations: ['categoria', 'loja', 'variacoes', 'avaliacoes'],
      });
      if (produto === null)
        throw new NotFoundException('Produto não encontrado.');
      return produto;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException('Erro ao buscar produto.');
    }
  }

  async findByPesquisa(search: string) {
    return await this.produtoRepository
      .find({
        where: { titulo: Like(`%${search}%`) },
        relations: ['categoria', 'loja', 'variacoes', 'avaliacoes'],
      })
      .then((produto) => {
        return produto;
      })
      .catch((err) => {
        throw new NotFoundException('Produto não encontrado.');
      });
  }

  public async findVariacoes(idProdutos: number) {
    try {
      const produto = await this.findById(idProdutos);
      if (produto.variacoes.length == 0) {
        return 'Não há variacoes para este produto.';
      }
      return await produto.variacoes;
    } catch (error) {
      throw new BadRequestException('Erro em buscar Variações desse Produto.');
    }
  }
  public async findAvaliacoes(idProdutos: number) {
    try {
      const produto = await this.findById(idProdutos);
      if (produto.avaliacoes.length == 0) {
        return 'Não há avaliações para este produto.';
      }
      return await produto.avaliacoes;
    } catch (error) {
      throw new BadRequestException('Erro em buscar avaliações desse Produto.');
    }
  }

  async findByDisponiveis(idLoja: number) {
    const loja = await this.lojaService.findById(idLoja);
    try {
      const produtos = await this.produtoRepository.find({
        where: {
          disponibilidade: true,
        },
        relations: ['categoria', 'loja', 'variacoes', 'avaliacoes'],
      });

      if (produtos.length === 0) {
        throw new NotFoundException('Não tem produto disponivel.');
      }

      return produtos;
    } catch (error) {
      if (error instanceof NotFoundException) return error;
      throw new BadRequestException('Erro em buscar disponiveis');
    }
  }

  async update(id: number, updateProdutoDto: UpdateProdutoDto) {
    return await this.produtoRepository
      .update(id, updateProdutoDto)
      .then(async () => {
        return await this.findById(id);
      })
      .catch(() => {
        throw new BadRequestException('Erro ao atualizar produto.');
      });
  }

  async remove(id: number) {
    const result = await this.produtoRepository.delete(id);

    if (result.affected === 0) {
      throw new NotFoundException(`Produto com id ${id} não encontrado`);
    }
  }

  async uploadFile(file: Express.MulterS3.File, idProduto: number) {
    const produto = await this.findById(idProduto);
    console.log(file);
    try {
      produto.foto = file.location;
      await this.produtoRepository.save(produto);
      return produto.foto;
    } catch (error) {
      throw new BadRequestException('Erro ao salvar imagem.');
    }
  }
}
