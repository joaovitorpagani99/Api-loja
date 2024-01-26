import { Module, forwardRef } from '@nestjs/common';
import { CategoriaService } from './service/categoria.service';
import { CategoriaController } from './controller/categoria.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Categoria } from './entities/categoria.entity';
import { LojaModule } from 'src/loja/loja.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Categoria]),
    forwardRef(() => LojaModule), 

  ],
  controllers: [CategoriaController],
  providers: [CategoriaService],
  exports: [CategoriaModule, CategoriaService]
})
export class CategoriaModule {}
