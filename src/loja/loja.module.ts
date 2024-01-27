import { Module, forwardRef } from '@nestjs/common';
import { LojaService } from './service/loja.service';
import { LojaController } from './controller/loja.controller';
import { Loja } from './entities/loja.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsuarioModule } from 'src/usuario/usuario.module';
import { CategoriaModule } from 'src/categoria/categoria.module';
import { ProdutoModule } from 'src/produto/produto.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Loja]),
    UsuarioModule
  ],
  controllers: [LojaController],
  providers: [LojaService],
  exports: [LojaService]
})
export class LojaModule {}
