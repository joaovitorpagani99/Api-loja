import { Injectable } from '@nestjs/common';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Usuario } from './entities/usuario.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UsuarioService {

  constructor(
    @InjectRepository(Usuario)
    private repository:Repository<Usuario> 
    ){}
  
  async create(createUsuarioDto: CreateUsuarioDto) {
    return this.repository.save(createUsuarioDto);
  }

  async findAll(): Promise<Usuario[]> {
    return await this.repository.find();
  }

  async findOne(id: number) {
    return await this.repository.findOneBy({id: id});
  }

  async update(id: number, updateUsuarioDto: UpdateUsuarioDto) {
    return await this.update(id, updateUsuarioDto);
  }

  async remove(id: number) {
    return await this.remove(id);
  }
}
