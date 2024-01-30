import { Module, forwardRef } from '@nestjs/common';
import { ProdutoService } from './service/produto.service';
import { ProdutoController } from './controller/produto.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Produto } from './entities/produto.entity';
import { LojaModule } from 'src/loja/loja.module';
import { CategoriaModule } from 'src/categoria/categoria.module';
import { CorreiosModule } from 'src/correios/correios.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Produto]),
    LojaModule,
    forwardRef(() => CategoriaModule),
    CorreiosModule,
  ],
  controllers: [ProdutoController],
  providers: [ProdutoService],
  exports: [ProdutoService],
})
export class ProdutoModule { }