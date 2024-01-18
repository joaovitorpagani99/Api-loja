import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'loja.c98gok6myc8k.us-east-1.rds.amazonaws.com',
      port: 3306,
      username: 'admin',
      password: '18191321',
      database: 'loja',
      autoLoadEntities: true,
      synchronize: true,
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
