import { ProdutoService } from 'src/produto/service/produto.service';
import { Loja } from 'src/loja/entities/loja.entity';
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateLojaDto } from '../dto/create-loja.dto';
import { UpdateLojaDto } from '../dto/update-loja.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UsuarioService } from 'src/usuario/service/usuario.service';


@Injectable()
export class LojaService {

  constructor(
    @InjectRepository(Loja)
    private readonly lojaRepository: Repository<Loja>,
    private readonly usuarioService: UsuarioService,
  ) { }

  async create(createLojaDto: CreateLojaDto): Promise<Loja> {
    const usuario = await this.usuarioService.findById(createLojaDto.idUsuario);
    if (!usuario) {
      throw new NotFoundException(`Usuário com id ${createLojaDto.idUsuario} não encontrado`);
    }
    if (usuario.permissao !== 'ADMIN') {
      throw new BadRequestException('Usuário não tem permissão para criar loja');
    }
    return this.lojaRepository.save({
      ...createLojaDto,
      administrador: usuario
    }).then((loja) => {
      return loja;
    }).catch((err) => {
      if (err.code === 'ER_DUP_ENTRY') {
        throw new BadRequestException('Email já está em uso');
      }
      throw new BadRequestException(err.message);
    });
  }

  async findAll(): Promise<Loja[]> {
    return await this.lojaRepository.find({
      relations: ['administrador']
    }).then((lojas) => {
      if (lojas.length === 0) {
        throw new NotFoundException('Nenhuma loja encontrada');
      }
      return Promise.all(lojas.map(loja => loja));
    }).catch(() => {
      throw new NotFoundException('Nenhuma loja encontrada');
    });
  }

  async findById(id: number): Promise<Loja> {

    const loja = await this.lojaRepository.findOne(
      {
        where: { id },
        relations: ['administrador', 'produtos']
      }
    );

    if (!loja) {
      throw new NotFoundException(`Loja com id ${id} não encontrada`);
    }
    return loja;
  }

  async update(id: number, updateLojaDto: UpdateLojaDto): Promise<Loja> {
    try {
      return await this.lojaRepository.update(id, updateLojaDto).then(async (loja) => {
        return await this.findById(id);
      }).catch(() => {
        throw new NotFoundException(`Loja com id ${id} não encontrada`);
      });
    } catch (error) {
      throw new BadRequestException("Erro ao atualizar loja");
    }
  }

  async remove(id: number) {
    try {
      const loja = await this.lojaRepository.findOne({
        where: { id },
        relations: ['administrador']
      });
      if (!loja) {
        throw new NotFoundException(`Loja com id ${id} não encontrada`);
      }
      /*await Promise.all(loja.produtos.map(produto => this.produtoService.remove(produto.id)));*/
      await this.lojaRepository.delete(id);
    } catch (error) {
      console.log(error);
      throw new BadRequestException("Erro ao remover loja");
    }
  }

  async getLojasDoUsuario(userId: number) {
    console.log(`Procurando lojas para o usuário com ID: ${userId}`);
    try {
      const lojas = await this.lojaRepository.find({
        where: {
          administrador: { id: userId }
        }
      });
      return lojas.map(loja => loja);
    } catch (error) {
      throw new Error(`Erro ao obter lojas do usuário: ${error.message}`);
    }
  }
}
