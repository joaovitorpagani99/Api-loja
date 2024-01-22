import { Module } from '@nestjs/common';
import { ClientesService } from './service/clientes.service';
import { ClientesController } from './controller/clientes.controller';
import { UsuarioService } from 'src/usuario/service/usuario.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cliente } from './entities/cliente.entity';
import { UsuarioModule } from 'src/usuario/usuario.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Cliente]),
    UsuarioModule
  ],
  controllers: [ClientesController],
  providers: [ClientesService],
})
export class ClientesModule {}
