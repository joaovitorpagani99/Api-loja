import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateClienteDto } from '../dto/create-cliente.dto';
import { UpdateClienteDto } from '../dto/update-cliente.dto';
import { In, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Cliente } from '../entities/cliente.entity';
import { UsuarioService } from 'src/usuario/service/usuario.service';
import { error } from 'console';
import { Role } from 'src/usuario/Enum/role-enum';

@Injectable()
export class ClientesService {

  constructor(
    @InjectRepository(Cliente)
    private clienteRepository: Repository<Cliente>,
    private usuarioService: UsuarioService,
  ) { }

  //ADMIN
  async buscarClientesPorNome(search: string) {
    this.clienteRepository.find({
      where: [
        { nome: In([search]) },
      ],
    }).then((clientes) => {
      return clientes;
    }).catch((err) => {
      throw new NotFoundException("Não foi encontrado nenhum cliente com esse nome.");
    });
  }

  async buscarPedidos(search: string) {
    this.clienteRepository.find({
      where: [
        { nome: In([search]) },
      ],
    }).then((clientes) => {
      return clientes;
    }).catch((err) => {
      throw new NotFoundException("Não foi encontrado nenhum pedido com esse nome.");
    });
  }

  async findPedidosClientes(idCliente: number, search: number) {
    this.clienteRepository.find({
      where: [
        {}
      ],
    })
  }



  async create(createClienteDto: CreateClienteDto) {
    console.log(createClienteDto);
    createClienteDto.deletado = false;
    createClienteDto.permissao = Role.USER;
    console.log(createClienteDto);
    return await this.clienteRepository.save(createClienteDto).then((cliente) => {
      this.usuarioService.create({
        nome: createClienteDto.nome,
        email: createClienteDto.email,
        senha: createClienteDto.senha,
        idade: createClienteDto.idade,
        permissao: Role.USER
      });
      return cliente;
    }).catch((err) => {
      throw new BadRequestException(err.message);
    });
  }

  async findAll() {
    return this.clienteRepository.find().then((clientes) => {
      return clientes;
    }).catch(error =>{
      throw new NotFoundException('Nenhuma cliente encontrado');
    });
  }

  async findById(id: string) {
    return this.clienteRepository.findOne({ where: { id: id } }).then((cliente) => {
      return cliente;
    }).catch((err) => {
      throw new NotFoundException("Cliente não encontrado");
    });
  }

  async update(id: string, updateClienteDto: UpdateClienteDto) {
    return this.clienteRepository.update(id, updateClienteDto).then((cliente) => {
      return this.findById(id);
    }).catch(err => {
      throw new NotFoundException(`Cliente com id ${id} não encontrado`);
    });
  }

  async remove(id: string) {
    await this.findById(id).then(async (cliente) => {
      if (cliente.deletado) {
        throw new BadRequestException("Cliente já deletado");
      }
      const usuario = await this.usuarioService.findByEmail(cliente.email);
      cliente.deletado = true;
      await this.clienteRepository.update(id, cliente);
      await this.usuarioService.remove(usuario.id);
    }).catch((err) => {
      throw new NotFoundException(`Cliente com id ${id} não encontrado`);
    });
  }
}
