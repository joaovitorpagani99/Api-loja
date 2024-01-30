import { TamanhoProdutoDto } from './../../correios/dto/tamanho-produto.dto';
import { CategoriaService } from './../../categoria/service/categoria.service';
import { LojaService } from './../../loja/service/loja.service';
import { Loja } from 'src/loja/entities/loja.entity';
import { BadRequestException, Inject, Injectable, NotFoundException, forwardRef } from '@nestjs/common';
import { CreateProdutoDto } from '../dto/create-produto.dto';
import { UpdateProdutoDto } from '../dto/update-produto.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Produto } from '../entities/produto.entity';
import { Like, Repository } from 'typeorm';
import { CorreiosService } from 'src/correios/service/correios.service';
import { CdServiceEnum } from 'src/correios/enums/correio-service.enum';

@Injectable()
export class ProdutoService {

  constructor(
    @InjectRepository(Produto)
    private readonly produtoRepository: Repository<Produto>,
    private readonly lojaService: LojaService,
    private readonly CategoriaService: CategoriaService,
    private readonly correiosService: CorreiosService,
  ) { }

  public async findPrecoCorreio(idProduto: number, cep: string) {
    const produto = await this.findById(idProduto);
    const tamanhoProduto = new TamanhoProdutoDto(produto.variacoes[0]);
    const returnCorreio = await this.correiosService.calcularPrecoPrazo( cep, tamanhoProduto);
    return returnCorreio;
  }

  async uploadFile(file: Express.MulterS3.File, idProduto: number) {
    try {
      console.log(file)
      const produto = await this.findById(idProduto);
      produto.foto = file.location;
      await this.produtoRepository.save(produto);
      console.log(produto.foto)
      return produto.foto;
    } catch (error) {
      throw new BadRequestException("Erro ao salvar imagem.");
    }
  }

  async create(createProdutoDto: CreateProdutoDto) {
    const loja = await this.lojaService.findById(createProdutoDto.idLoja);
    const categoria = await this.CategoriaService.findById(createProdutoDto.idLoja.toString(), createProdutoDto.categoriaId);

    try {
      const produto = await this.produtoRepository.save({
        ...createProdutoDto,
        loja,
        categoria
      });

      const { loja: _, categoria: __, ...produtoSemLojaECategoria } = produto;
      return produtoSemLojaECategoria;
    } catch (error) {
      throw new BadRequestException("Erro ao salvar produto.");
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
      if (!produto) throw new NotFoundException("Produto não encontrado.");
      return produto;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException("Erro ao buscar produto.");
    }


  }

  async findByPesquisa(search: string) {
    return await this.produtoRepository.find({
      where: { titulo: Like(`%${search}%`) },
      relations: ['categoria', 'loja', 'variacoes', 'avaliacoes'],
    }).then((produto) => {
      return produto;
    }).catch((err) => {
      throw new NotFoundException("Produto não encontrado.");
    });
  }

  public async findVariacoes(idProdutos: number) {
    try {
      const produto = await this.findById(idProdutos);
      if (produto.variacoes.length == 0) {
        return "Não há variacoes para este produto.";
      }
      return await produto.variacoes
    } catch (error) {
      throw new BadRequestException("Erro em buscar Variações desse Produto.")
    }
  }
  public async findAvaliacoes(idProdutos: number) {
    try {
      const produto = await this.findById(idProdutos);
      if (produto.avaliacoes.length == 0) {
        return "Não há avaliações para este produto.";
      }
      return await produto.avaliacoes;
    } catch (error) {
      throw new BadRequestException("Erro em buscar avaliações desse Produto.")
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
        throw new NotFoundException("Não tem produto disponivel.");
      }

      return produtos;
    } catch (error) {
      if (error instanceof NotFoundException) return error;
      throw new BadRequestException("Erro em buscar disponiveis")
    }

  }

  async update(id: number, updateProdutoDto: UpdateProdutoDto) {
    return await this.produtoRepository.update(id, updateProdutoDto).then(async () => {
      return await this.findById(id);
    }).catch(() => {
      throw new BadRequestException("Erro ao atualizar produto.");
    });
  }

  async remove(id: number) {
    const result = await this.produtoRepository.delete(id);

    if (result.affected === 0) {
      throw new NotFoundException(`Produto com id ${id} não encontrado`);
    }
  }
}