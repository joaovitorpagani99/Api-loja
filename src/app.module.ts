import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { UsuarioModule } from './usuario/usuario.module';
import { Usuario } from './usuario/entities/usuario.entity';
import { AuthModule } from './auth/auth.module';
import { LojaModule } from './loja/loja.module';
import { Loja } from './loja/entities/loja.entity';
import { ClientesModule } from './clientes/clientes.module';
import { Cliente } from './clientes/entities/cliente.entity';
import { PedidoModule } from './pedido/pedido.module';
import { PagamentoModule } from './pagamento/pagamento.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      entities: [Usuario, Loja, Cliente],
      synchronize: process.env.NODE_ENV !== 'production', 
      extra: {
          trustServerCertificate: true,  // confiar no certificado do servidor
          Encrypt: true,  // habilitar criptografia
          IntegratedSecurity: false, // desabilitar segurança integrada
      }, 
    }),
    AuthModule,
    UsuarioModule,
    LojaModule,
    ClientesModule,
    PedidoModule,
    PagamentoModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule { }
