import { Module } from '@nestjs/common';
import { AuthService } from './service/auth.service';
import { AuthController } from './contoller/auth.controller';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { UsuarioModule } from 'src/usuario/usuario.module';
import * as dotenv from 'dotenv';

dotenv.config();

@Module({
  imports: [
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '10d' },
    }),
    UsuarioModule
  ],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [AuthService]
})
export class AuthModule { }
