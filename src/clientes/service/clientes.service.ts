import {
  BadRequestException,
  ConflictException,
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
import { Loja } from 'src/loja/entities/loja.entity';

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

  async create(createClienteDto: CreateClienteDto) {
    const loja = await this.lojaService.findById(createClienteDto.idLoja);

    const buscarEmail = await this.findByEmail(createClienteDto.email);

    /* if(buscarEmail && buscarEmail.lojas[0].id === loja.id && buscarEmail.ativo === true){
      throw new ConflictException('Usuario já cadastrado nesta loja, com este email.');
    }*/

    createClienteDto.ativo = true;
    createClienteDto.permissao = Role.USER;
    const cliente = await this.clienteRepository
      .save({
        ...createClienteDto,
        loja: loja,
      })
      .catch((err) => {
        if (err.code === 'ER_DUP_ENTRY') {
          throw new ConflictException(
            'CPF ou EMAIL já cadastrado.',
            err.message,
          );
        }
        throw new BadRequestException(err.message);
      });

    try {
      loja.clientes.push(cliente);
      await this.lojaService.saveCliente(loja);
      await this.usuarioService.criarUsuarioCliente(cliente);
    } catch (error) {
      console.log(error);
      if(error instanceof ConflictException){
        throw new ConflictException(error.message);
      }
      throw new BadRequestException(error.message);
    }
    const clienteAT = {
      id: cliente.id,
      nome: cliente.nome,
      email: cliente.email,
      idade: cliente.idade,
      ativo: cliente.ativo,
      loja: cliente.loja.nome,
    };
    return clienteAT;

  }

  async findAll(): Promise<Cliente[]> {
    const clientes = await this.clienteRepository
      .find({
        relations: ['lojas'],
      })
      .catch((error) => {
        throw new BadRequestException('Erro em listar clientes.');
      });
    if (clientes.length === 0)
      throw new NotFoundException('Nenhum cliente encontrado');
    return clientes;
  }

  async findById(id: number): Promise<Cliente> {
    try {
      const cliente = await this.clienteRepository.findOne({
        where: { id },
        relations: ['lojas'],
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
        cliente.ativo = false;
        await this.clienteRepository.update(id, cliente);
        await this.usuarioService.remove(usuario.id);
      })
      .catch((err) => {
        throw new NotFoundException(`Cliente com id ${id} não encontrado`);
      });
  }

  async findByEmail(email: string): Promise<Cliente> {
    const client = await this.clienteRepository.findOne({
      where: { email: email },
      relations: ['lojas'],
    });
    return client;
  }
}
