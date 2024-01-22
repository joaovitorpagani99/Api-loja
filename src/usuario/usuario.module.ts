import { Logger, Module } from '@nestjs/common';
import { UsuarioService } from './service/usuario.service';
import { UsuarioController } from './controller/usuario.controller';
import { Usuario } from './entities/usuario.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forFeature([Usuario],
      )
],
  controllers: [UsuarioController],
  providers: [UsuarioService
  
  ],
  exports: [UsuarioService],
})
export class UsuarioModule {}
