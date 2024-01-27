import { LojaService } from './../../loja/service/loja.service';
import { Categoria } from './../entities/categoria.entity';
import { BadRequestException, Inject, Injectable, NotFoundException, forwardRef } from '@nestjs/common';
import { CreateCategoriaDto } from '../dto/create-categoria.dto';
import { UpdateCategoriaDto } from '../dto/update-categoria.dto';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ProdutoService } from 'src/produto/service/produto.service';

@Injectable()
export class CategoriaService {

  constructor(
    @InjectRepository(Categoria)
    private categoriaRepository: Repository<Categoria>,
    private lojaService: LojaService,
    @Inject(forwardRef(() => ProdutoService))
    private produtoService: ProdutoService
  ) { }


  public async create(createCategoriaDto: CreateCategoriaDto) {
    const loja = await this.lojaService.findById(createCategoriaDto.idLoja);

    if (!loja) {
      throw new NotFoundException(`Loja com ID ${createCategoriaDto.idLoja} não encontrada`);
    }

    try {
      const categoria = await this.categoriaRepository.save({
        ...createCategoriaDto,
        loja
      });
      console.log(categoria);
      return categoria;
    } catch (error) {
      if (error.code === 'ER_DUP_ENTRY') {
        throw new BadRequestException("Categoria com esse código já existe.");
      }
      throw new BadRequestException("Erro ao salvar categoria.");
    }
  }

  public async findAll(lojaId: number): Promise<Categoria[]> {
    const loja = await this.lojaService.findById(lojaId);
    if (!loja) {
      throw new NotFoundException(`Loja com ID ${lojaId} não encontrada`);
    }
    return await this.categoriaRepository.find(
      {
        relations: ['produtos', 'loja'],
      }
    ).catch(() => {
      throw new NotFoundException("Nenhuma categoria encontrada para esse id de loja.");
    });
  }


  public async getCategoriasDisponivel(idLoja: string) {
    const loja = await this.lojaService.findById(+idLoja);
    return await this.categoriaRepository.find(
      {
        where: { disponibilidade: true },
        relations: ['produtos', 'loja'],
      }
    ).then(categorias => {
      if (categorias.length === 0) {
        throw new NotFoundException("Nenhuma categoria disponivel.");
      }
      return categorias;
    }).catch(error => {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException("Não foi possível encontrar as categorias");
    });
  }

  public async findById(idLoja: string, id: number) {
    const loja = await this.lojaService.findById(+idLoja);
    return this.categoriaRepository.findOne(
      {
        where: { id },
        relations: ['produtos', 'loja'],
      }
    ).then(categoria => {
      if (!categoria) {
        throw new NotFoundException("Categoria não encontrada");
      }
      return categoria;
    }).catch(error => {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException("Erro com as requisições");
    });

  }

  public async update(id: number, updateCategoriaDto: UpdateCategoriaDto) {
    return await this.categoriaRepository.update(id, updateCategoriaDto).then(categoria => {
      return this.categoriaRepository.findOne({
        where: { id },
        relations: ['produtos', 'loja'],
      });
    }).catch(error => {
      throw new NotFoundException("Não foi possível encontrar a categoria");
    });
  }

  public async remove(id: number) {
    const categoria = await this.categoriaRepository.findOne({ where: { id } });
    if (!categoria) {
      throw new NotFoundException(`Categoria com id ${id} não encontrada`);
    }

    await this.categoriaRepository.delete(id);
  }

  public async mostrarProdutosPorIdCategoria(id: number) {
    const categoria = await this.categoriaRepository.findOne({
      where: { id },
      relations: ['produtos'],
    });
    if (!categoria) {
      throw new NotFoundException('Categoria não encontrada');
    }

    if(categoria.produtos.length === 0){
      throw new NotFoundException('Categoria não possui produtos');
    }
    return categoria.produtos;
  }

  public async updateProdutos(id: number, produtos: string[]) {
    const categoria = await this.categoriaRepository.findOne({
      where: { id },
      relations: ['produtos'],
    });
    if (!categoria) {
      throw new NotFoundException('Categoria não encontrada');
    }

    const produtosObjetos = await Promise.all(produtos.map(async (produtoId) => {
      const produto = await this.produtoService.findById(+produtoId);
      if (!produto) {
        throw new NotFoundException(`Produto com id ${produtoId} não encontrado`);
      }
      return produto;
    }));
  
    categoria.produtos = produtosObjetos;
    await this.categoriaRepository.save(categoria);
  }
}
