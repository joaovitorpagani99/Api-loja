import { ResponseLoja } from './../dto/response-loja.dto';
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateLojaDto } from '../dto/create-loja.dto';
import { UpdateLojaDto } from '../dto/update-loja.dto';
import { Loja } from '../entities/loja.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';


@Injectable()
export class LojaService {
 
  constructor(
    @InjectRepository(Loja)
    private lojaRepository: Repository<Loja>,
  ) { }

  async create(createLojaDto: CreateLojaDto): Promise<ResponseLoja> {
    return this.lojaRepository.save(createLojaDto).then((loja) => {
      return this.responseLoja(loja);
    }).catch((err) => {
      throw new BadRequestException(err.message);
    });
  }

  async findAll(): Promise<ResponseLoja[]> {
    return this.lojaRepository.find().then((lojas) => {
      if (lojas.length === 0) {
        throw new NotFoundException('Nenhuma loja encontrada');
      }
      return Promise.all(lojas.map(loja => this.responseLoja(loja)));
    });
  }

  async findById(id: number): Promise<ResponseLoja> {
    return this.lojaRepository.findOne({ where: { id } }).then((loja) => {
      return this.responseLoja(loja);
    }).catch((err) => {
      throw new NotFoundException("Loja não encontrada");
    });
  }

  async update(id: number, updateLojaDto: UpdateLojaDto): Promise<ResponseLoja> {
    return this.lojaRepository.update(id, updateLojaDto).then((loja) => {
      return this.findById(id);
    }).catch(err => {
      throw new NotFoundException(`Loja com id ${id} não encontrada`);
    });
  }

  async remove(id: number) {
    const loja = await this.lojaRepository.findOne({ where: { id } });
    if (!loja) {
      throw new NotFoundException(`Loja com id ${id} não encontrada`);
    }

    return this.lojaRepository.delete(id);
  }

  async getLojasDoUsuario(userId: number) {
    console.log(`Procurando lojas para o usuário com ID: ${userId}`);
    try {
      const lojas = await this.lojaRepository.find({ 
        where: { 
          administrador: { id: userId } 
        } 
      });
      return lojas.map(loja => this.responseLoja(loja));
    } catch (error) {
      throw new Error(`Erro ao obter lojas do usuário: ${error.message}`);
    }
  }



  private async responseLoja(loja: Loja): Promise<ResponseLoja> {
    const response: ResponseLoja = {
      id : loja.id,
      nome: loja.nome,
      endereco: loja.endereco,
      telefone: loja.telefone,
      cnpj: loja.cnpj,
      usuario: loja.administrador
    };
    return response;
  }
}
