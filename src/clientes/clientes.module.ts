import { Module } from '@nestjs/common';
import { ClientesService } from './service/clientes.service';
import { ClientesController } from './controller/clientes.controller';
import { UsuarioService } from 'src/usuario/service/usuario.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cliente } from './entities/cliente.entity';
import { UsuarioModule } from 'src/usuario/usuario.module';
import { LojaService } from 'src/loja/service/loja.service';
import { LojaModule } from 'src/loja/loja.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Cliente]),
    UsuarioModule,
    LojaModule
  ],
  controllers: [ClientesController],
  providers: [ClientesService],
  exports: [ClientesService]
})
export class ClientesModule {}
