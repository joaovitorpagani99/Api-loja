import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateClienteDto } from '../dto/create-cliente.dto';
import { UpdateClienteDto } from '../dto/update-cliente.dto';
import { In, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Cliente } from '../entities/cliente.entity';
import { UsuarioService } from 'src/usuario/service/usuario.service';
import { Role } from 'src/usuario/Enum/role-enum';
import { LojaService } from 'src/loja/service/loja.service';

@Injectable()
export class ClientesService {
  constructor(
    @InjectRepository(Cliente)
    private clienteRepository: Repository<Cliente>,
    private usuarioService: UsuarioService,
    private lojaService: LojaService,
  ) {}

  //ADMIN
  async buscarClientesPorNome(search: string) {
    this.clienteRepository
      .find({
        where: [{ nome: In([search]) }],
      })
      .then((clientes) => {
        return clientes;
      })
      .catch((err) => {
        throw new NotFoundException(
          'Não foi encontrado nenhum cliente com esse nome.',
        );
      });
  }

  async buscarPedidos(search: string) {
    this.clienteRepository
      .find({
        where: [{ nome: In([search]) }],
      })
      .then((clientes) => {
        return clientes;
      })
      .catch((err) => {
        throw new NotFoundException(
          'Não foi encontrado nenhum pedido com esse nome.',
        );
      });
  }

  async findPedidosClientes(idCliente: number, search: number) {
    this.clienteRepository.find({
      where: [{}],
    });
  }

  async create(createClienteDto: CreateClienteDto, idLoja: string) {
    const loja = await this.lojaService.findById(+idLoja);
    const buscarEmail = await this.findByEmail(createClienteDto.email);
    if (buscarEmail.lojas[0].id === loja.id && buscarEmail.ativo === true) {
      throw new BadRequestException('Email já cadastrado nesta loja.');
    }
    createClienteDto.ativo = false;
    createClienteDto.permissao = Role.USER;

    return await this.clienteRepository
      .save({
        ...createClienteDto,
        loja: loja,
      })
      .then(async (cliente) => {
        await this.usuarioService.create({
          nome: createClienteDto.nome,
          email: createClienteDto.email,
          senha: createClienteDto.senha,
          idade: createClienteDto.idade,
          permissao: Role.USER,
        });
        return {
          id: cliente.id,
          nome: cliente.nome,
          email: cliente.email,
          idade: cliente.idade,
          ativo: cliente.ativo,
        };
      })
      .catch((err) => {
        throw new BadRequestException(err.message);
      });
  }

  async findAll() {
    return await this.clienteRepository
      .find()
      .then(async (clientes) => {
        return await clientes;
      })
      .catch((error) => {
        throw new NotFoundException('Nenhuma cliente encontrado');
      });
  }

  async findById(id: number): Promise<Cliente> {
    try {
      const cliente = await this.clienteRepository.findOne({
        where: { id },
      });
      if (!cliente) throw new NotFoundException('Entrega não encontrada');

      return cliente;
    } catch (error) {
      throw new BadRequestException('Erro ao buscar cliente.');
    }
  }

  async update(id: string, updateClienteDto: UpdateClienteDto) {
    return await this.clienteRepository
      .update(id, updateClienteDto)
      .then(async (cliente) => {
        return await this.findById(+id);
      })
      .catch((err) => {
        throw new NotFoundException(`Cliente com id ${id} não encontrado`);
      });
  }

  async remove(id: string) {
    await this.findById(+id)
      .then(async (cliente) => {
        if (cliente.ativo === false) {
          throw new BadRequestException('Cliente já deletado');
        }
        const usuario = await this.usuarioService.findByEmail(cliente.email);
        cliente.ativo = true;
        await this.clienteRepository.update(id, cliente);
        await this.usuarioService.remove(usuario.id);
      })
      .catch((err) => {
        throw new NotFoundException(`Cliente com id ${id} não encontrado`);
      });
  }

  async findByEmail(email: string) {
    const client = await this.clienteRepository.findOne({
      where: { email: email },
    });
    if (!client) {
      throw new NotFoundException('Cliente não encontrado');
    }
    return client;
  }
}
