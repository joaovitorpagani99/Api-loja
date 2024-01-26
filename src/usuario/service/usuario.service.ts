import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateUsuarioDto } from '../dto/create-usuario.dto';
import { UpdateUsuarioDto } from '../dto/update-usuario.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Usuario } from '../entities/usuario.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsuarioService {

  constructor(
    @InjectRepository(Usuario)
    private repository: Repository<Usuario>,
  ) { }

  async create(createUsuarioDto: CreateUsuarioDto) {
    try {
      createUsuarioDto.senha = await this.hashSenha(createUsuarioDto.senha);
      const usuario = await this.repository.save(createUsuarioDto);
      delete usuario.senha;
      delete usuario.recoveryToken;
      delete usuario.recoveryDate;
      delete usuario.confirmationToken
      return usuario;
    } catch (error) {
      if (error.code === 'ER_DUP_ENTRY') {
        throw new BadRequestException('Email já está em uso');
      }
      throw new BadRequestException("Erro ao salvar o usuario");
    }

  }

  async findAll(): Promise<Usuario[]> {
    return this.repository.find({
      relations: ['loja'],
    }).then((usuarios) => {
      return usuarios.map((usuario) => {
        delete usuario.senha;
        delete usuario.recoveryToken;
        delete usuario.recoveryDate;
        delete usuario.confirmationToken
        return usuario;
      });
    }).catch(() => {
      throw new NotFoundException('Não foi possível encontrar os usuarios');
    });
  }

  async findById(id: number): Promise<Usuario> {
    try {
      const usuario = await this.repository.findOne({
        where: { id: id },
        relations: ['loja'],
      });
      if (usuario === null) {
        throw new NotFoundException(`Usuario não encontrado para o id ${id}`);
      }
      delete usuario.senha;
      delete usuario.recoveryToken;
      delete usuario.recoveryDate;
      delete usuario.confirmationToken
      return usuario;
    } catch (error) {
      throw new BadRequestException(`Usuario não encontrado para o id ${id}`);
    }
  }

  async findByEmail(email: string): Promise<Usuario> {
    const usuario = await this.repository.findOne({
      where: { email: email },
      relations: ['loja'],
    });
    if (usuario === null) {
      throw new NotFoundException(`Usuario não encontrado para o email ${email}`);
    }
    delete usuario.senha;
    delete usuario.recoveryToken;
    delete usuario.recoveryDate;
    delete usuario.confirmationToken
    return usuario;
  }

  async update(id: number, updateUsuarioDto: UpdateUsuarioDto): Promise<Usuario> {
    return await this.repository.update(id, updateUsuarioDto).then(async () => {
      return await this.findById(id);
    }).catch(() => {
      throw new NotFoundException(`Usuario não encontrado para o id ${id}`);
    });
  }

  async remove(id: number) {
    const usuario = await this.repository.findOne({
      where: { id: id },
    });
    if (usuario === null) {
      throw new NotFoundException(`Usuario não encontrado para o id ${id}`);
    }
    await this.repository.delete(id);
  }



  private async hashSenha(password: string): Promise<string> {
    return await bcrypt.hash(password, 12);
  }

}
