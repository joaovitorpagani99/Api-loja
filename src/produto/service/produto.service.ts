import { CategoriaService } from './../../categoria/service/categoria.service';
import { LojaService } from './../../loja/service/loja.service';
import { Loja } from 'src/loja/entities/loja.entity';
import { BadRequestException, Inject, Injectable, NotFoundException, forwardRef } from '@nestjs/common';
import { CreateProdutoDto } from '../dto/create-produto.dto';
import { UpdateProdutoDto } from '../dto/update-produto.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Produto } from '../entities/produto.entity';
import { Like, Repository } from 'typeorm';

@Injectable()
export class ProdutoService {

  constructor(
    @InjectRepository(Produto)
    private readonly produtoRepository: Repository<Produto>,
    private readonly lojaService: LojaService,
    private readonly CategoriaService: CategoriaService,
  ) { }

  async create(createProdutoDto: CreateProdutoDto) {
    const loja = await this.lojaService.findById(createProdutoDto.idLoja);
    const categoria = await this.CategoriaService.findById(createProdutoDto.idLoja.toString() ,createProdutoDto.categoriaId);

    if (!loja) {
      throw new NotFoundException('Loja não encontrada');
    }

    try {
      const produto = await this.produtoRepository.save({
        ...createProdutoDto,
        loja,
        categoria
      });
      return produto;
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
    const produto = await this.produtoRepository.findOne({
      where: { id },
      relations: ['categoria', 'loja', 'variacoes', 'avaliacoes', 'pedido'],
    });
    if (!produto) throw new NotFoundException("Produto não encontrado.");
    return produto;

  }

  async findByPesquisa(search: string) {
    return this.produtoRepository.find({
      where: { titulo: Like(`%${search}%`) },
      relations: ['categoria', 'loja', 'variacoes', 'avaliacoes', 'pedido'],
    }).then((produto) => {
      return produto;
    }).catch((err) => {
      throw new NotFoundException("Produto não encontrado.");
    });
  }


  async findByDisponiveis(idLoja: number) {
    /*const loja = await this.lojaService.findById(idLoja);
    if (!loja) throw new NotFoundException("Loja não encontrada.");*/
    const produtos = await this.produtoRepository.find({
      where: {
        disponibilidade: true,
      },
      relations: ['categoria', 'loja', 'variacoes', 'avaliacoes', 'pedido'],
    });

    if (produtos.length === 0) {
      throw new NotFoundException("Não tem produto disponivel.");
    }

    return produtos;
  }

  async update(id: number, updateProdutoDto: UpdateProdutoDto) {
    return this.produtoRepository.update(id, updateProdutoDto).then(() => {
      return this.findById(id);
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

/*
async create(createProdutoDto: CreateProdutoDto): Promise<Produto> {
  const produto = new Produto();
  // Atribui os valores do DTO ao produto
  produto.titulo = createProdutoDto.titulo;
  // ...

  // Busca as variações e as associa ao produto
  if (createProdutoDto.variacoesIds) {
      produto.variacoes = await Promise.all(
          createProdutoDto.variacoesIds.map(id => this.variacoesRepository.findOne(id))
      );
  }

  return this.produtoRepository.save(produto);
}
*/