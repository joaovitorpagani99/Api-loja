import { Injectable } from '@nestjs/common';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Usuario } from './entities/usuario.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsuarioService {


  constructor(
    @InjectRepository(Usuario)
    private repository: Repository<Usuario>
  ) { }

  async create(createUsuarioDto: CreateUsuarioDto) {
    createUsuarioDto.senha = await this.hashSenha(createUsuarioDto.senha);
    const usuario = await this.repository.save(createUsuarioDto);
    return await {
      ...usuario,
      delete: usuario.senha,
    };
  }

  async findAll(): Promise<Usuario[]> {
    return this.repository.find().then((usuarios) => {
      usuarios.forEach((usuario) => {
        delete usuario.senha;
      });
      return usuarios;
    });
  }

  async findById(id: number) {
    return await this.repository.findOneBy({ id: id });
  }

  async findByEmail(email: string){
    return await this.repository.findOneBy({ email: email });
  }

  async update(id: number, updateUsuarioDto: UpdateUsuarioDto) {
    return await this.repository.update(id, updateUsuarioDto);
  }

  async remove(id: number) {
    return await this.repository.delete(id);
  }


  private async hashSenha(password: string): Promise<string> {
    return await bcrypt.hash(password, 12);
  }

}
