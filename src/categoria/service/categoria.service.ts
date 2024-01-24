import { LojaService } from './../../loja/service/loja.service';
import { Categoria } from './../entities/categoria.entity';
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateCategoriaDto } from '../dto/create-categoria.dto';
import { UpdateCategoriaDto } from '../dto/update-categoria.dto';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class CategoriaService {

  constructor(
    @InjectRepository(Categoria)
    private categoriaRepository: Repository<Categoria>,
    private lojaService: LojaService,
  ) { }


  public async create(createCategoriaDto: CreateCategoriaDto) {
    return this.categoriaRepository.save(createCategoriaDto).then(categoria => {
      return categoria;
    }).catch(error => {
      throw new BadRequestException(error.message);
    });
  }

  public async findAll(lojaId: string) {
    const loja = await this.lojaService.findById(+lojaId);

    if (!loja) {
      throw new NotFoundException(`Loja com ID ${lojaId} não encontrada`);
    }

    return this.categoriaRepository.find(
      {
        where: { loja },
        relations: ['produtos']
      }
    ).then(categorias => {
      return categorias;
    }).catch(error => {
      throw new NotFoundException("Não foi possível encontrar as categorias");
    });
  }

  public async getCategoriasDisponivel(idLoja: string) {
    const loja = await this.lojaService.findById(+idLoja);
    return this.categoriaRepository.find(
      {
        where: { disponibilidade: true, loja: loja }
      }
    ).then(categorias => {
      return categorias;
    }).catch(error => {
      throw new NotFoundException("Não foi possível encontrar as categorias");
    });
  }

  public async findById(idLoja: string, id: number) {
    const loja = await this.lojaService.findById(+idLoja);
    return this.categoriaRepository.findOne(
      {
        where: { id , loja: loja}
      }
    ).then(categoria => {
      return categoria;
    }).catch(error => {
      throw new NotFoundException("Não foi possível encontrar a categoria");
    });

  }

  public async update(id: number, updateCategoriaDto: UpdateCategoriaDto) {
    return this.categoriaRepository.update(id, updateCategoriaDto).then(categoria => {
      return categoria;
    }).catch(error => {
      throw new NotFoundException("Não foi possível encontrar a categoria");
    });
  }

  public async remove(id: number) {
    const categoria = await this.categoriaRepository.findOne({ where: { id } });
    if (!categoria) {
      throw new NotFoundException(`Categoria com id ${id} não encontrada`);
    }

    return this.categoriaRepository.delete(id);
  }
}
