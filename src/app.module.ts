import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { UsuarioModule } from './usuario/usuario.module';
import { Usuario } from './usuario/entities/usuario.entity';

@Module({
  imports: [
    UsuarioModule,
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      entities: [Usuario],
      synchronize: process.env.NODE_ENV !== 'production', 
      extra: {
          trustServerCertificate: true,  // confiar no certificado do servidor
          Encrypt: true,  // habilitar criptografia
          IntegratedSecurity: false, // desabilitar segurança integrada
      }, 
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
