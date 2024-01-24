import { Module } from '@nestjs/common';
import { LojaService } from './service/loja.service';
import { LojaController } from './controller/loja.controller';
import { Loja } from './entities/loja.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forFeature([Loja]),
  ],
  controllers: [LojaController],
  providers: [LojaService],
  exports: [LojaService]
})
export class LojaModule {}
