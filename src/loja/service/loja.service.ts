import { ProdutoService } from 'src/produto/service/produto.service';
import { Loja } from 'src/loja/entities/loja.entity';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateLojaDto } from '../dto/create-loja.dto';
import { UpdateLojaDto } from '../dto/update-loja.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UsuarioService } from 'src/usuario/service/usuario.service';
import { Cliente } from 'src/clientes/entities/cliente.entity';

@Injectable()
export class LojaService {
  constructor(
    @InjectRepository(Loja)
    private readonly lojaRepository: Repository<Loja>,
    private readonly usuarioService: UsuarioService,
  ) {}

  async create(createLojaDto: CreateLojaDto): Promise<Loja> {
    const usuario = await this.usuarioService.findById(createLojaDto.idUsuario);

    if (usuario.permissao !== 'ADMIN') {
      throw new BadRequestException(
        'Usuário não tem permissão para criar loja',
      );
    }
    return await this.lojaRepository
      .save({
        ...createLojaDto,
        administrador: usuario,
      })
      .catch((err) => {
        throw new BadRequestException(err.message);
      });
  }

  async findAll(email: string): Promise<Loja[]> {
    const usuario = await this.usuarioService.findByEmail(email);
    if (usuario == null) {
      throw new BadRequestException('Usuário não encontrado');
    }

    const lojas = await this.lojaRepository.find({
      where: { administrador: {id: usuario.id}},
      relations: ['administrador', 'categorias', 'produtos', 'clientes'],
    });

    if (lojas.length === 0) {
      throw new NotFoundException('Nenhuma loja encontrada');
    }
    const lojasSemSenha = lojas.map((loja) => {
      delete loja.administrador.senha;
      delete loja.administrador.recoveryToken;
      delete loja.administrador.recoveryDate;
      delete loja.administrador.confirmationToken;
      return loja;
    });
    return lojasSemSenha;
  }

  async findById(idLoja: number): Promise<Loja> {
    const loja = await this.lojaRepository.findOne({
      where: { id: idLoja },
      relations: ['clientes'],
    });

    if (!loja) {
      throw new NotFoundException(`Loja com id ${idLoja} não encontrada`);
    }
    return {
      ...loja,
      administrador: {
        ...loja.administrador,
        senha: undefined,
        recoveryToken: undefined,
        recoveryDate: undefined,
        confirmationToken: undefined,
      },
    };
  }

  async update(id: number, updateLojaDto: UpdateLojaDto): Promise<Loja> {
    return await this.lojaRepository
      .update(id, updateLojaDto)
      .then(async (loja) => {
        return await this.findById(id);
      })
      .catch(() => {
        throw new NotFoundException(`Loja com id ${id} não encontrada`);
      });
  }

  async remove(id: number, email: string): Promise<void> {
    const usuario = await this.usuarioService.findByEmail(email);

    try {
      const loja = await this.lojaRepository.findOne({
        where: { id, administrador: usuario },
      });
      if (!loja) {
        throw new NotFoundException(
          `Esse usuario não tem essa loja com o id ${id} cadastrado.`,
        );
      }
      await this.lojaRepository.delete(id);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException('Erro ao remover loja');
    }
  }

  async getLojasDoUsuario(email: string) {
    const usuario = await this.usuarioService.findByEmail(email);
    if (usuario == null) throw new NotFoundException('Usuário não encontrado');
    try {
      const lojas = await this.lojaRepository.find({
        where: {
          administrador: { id: usuario.id },
        },
      });
      return lojas.map((loja) => loja);
    } catch (error) {
      throw new Error(`Erro ao obter lojas do usuário: ${error.message}`);
    }
  }

  async saveCliente(loja: Loja){
    return await this.lojaRepository.save(loja);
  }
}
