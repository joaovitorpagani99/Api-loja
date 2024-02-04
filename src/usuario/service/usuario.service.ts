import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUsuarioDto } from '../dto/create-usuario.dto';
import { UpdateUsuarioDto } from '../dto/update-usuario.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Usuario } from '../entities/usuario.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Role } from '../Enum/role-enum';

@Injectable()
export class UsuarioService {
  constructor(
    @InjectRepository(Usuario)
    private repository: Repository<Usuario>,
  ) {}

  async create(createUsuarioDto: CreateUsuarioDto): Promise<Usuario> {
    createUsuarioDto.permissao = Role.ADMIN;
    const usuarioExistente = await this.findByEmail(createUsuarioDto.email);
    if (usuarioExistente && usuarioExistente.permissao === Role.ADMIN) {
      throw new BadRequestException('Email já cadastrado');
    }
    try {
      createUsuarioDto.senha = await this.hashSenha(createUsuarioDto.senha);
      const usuario = await this.repository.save(createUsuarioDto);
      delete usuario.senha;
      delete usuario.recoveryToken;
      delete usuario.recoveryDate;
      delete usuario.confirmationToken;
      return usuario;
    } catch (error) {
      throw new BadRequestException('Erro ao salvar o usuario');
    }
  }

  async findAll(): Promise<Usuario[]> {
    const usuarios = await this.repository.find({ relations: ['lojas'] });
    console.log(usuarios);
    if (usuarios.length === 0) {
      throw new NotFoundException('Nenhum usuario encontrado');
    }

    const usuario = usuarios.map((usuario) => {
      delete usuario.senha;
      delete usuario.recoveryToken;
      delete usuario.recoveryDate;
      delete usuario.confirmationToken;
      return usuario;
    });
    
    return usuario;
  }

  async findById(id: number): Promise<Usuario> {
    try {
      const usuario = await this.repository.findOne({
        where: { id: id },
        relations: ['lojas'],
      });
      if (usuario === null) {
        throw new NotFoundException(`Usuario não encontrado para o id ${id}`);
      }
      delete usuario.senha;
      delete usuario.recoveryToken;
      delete usuario.recoveryDate;
      delete usuario.confirmationToken;
      return usuario;
    } catch (error) {
      throw new BadRequestException(`Usuario não encontrado para o id ${id}`);
    }
  }

  async findByEmail(email: string): Promise<Usuario> {
    const usuario = await this.repository.findOne({
      where: [
        { email: email },
      ],
    });

    return usuario;
  }

  async update(
    id: number,
    updateUsuarioDto: UpdateUsuarioDto,
  ): Promise<Usuario> {
    if (updateUsuarioDto.senha) {
      updateUsuarioDto.senha = await this.hashSenha(updateUsuarioDto.senha);
    }
    if (updateUsuarioDto.email) {
      const usuarioExistente = await this.findByEmail(updateUsuarioDto.email);
      if (usuarioExistente && usuarioExistente.id !== id) {
        throw new BadRequestException('Email já cadastrado');
      }
    }
    return await this.repository
      .update(id, updateUsuarioDto)
      .then(async () => {
        return await this.findById(id);
      })
      .catch(() => {
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

  async criarUsuarioCliente(cliente: any): Promise<boolean> {
    const verficarExistencia = await this.findByEmail(cliente.email);
    
    if (verficarExistencia && verficarExistencia.cliente === true) {
      throw new ConflictException('Email já cadastrado');
    }
    const usuario = new Usuario();
    usuario.nome = cliente.nome;
    usuario.email = cliente.email;
    usuario.senha = await this.hashSenha(cliente.senha);
    usuario.permissao = Role.USER;
    usuario.cliente = true;
    try {
      const cliente = await this.repository.save(usuario);
      return true;
    } catch (error) {
      throw new BadRequestException('Erro ao salvar o usuario');
    }
  }

  private async hashSenha(password: string): Promise<string> {
    return await bcrypt.hash(password, 12);
  }
}
