import { Module } from '@nestjs/common';
import { VariacoesService } from './service/variacoes.service';
import { VariacoesController } from './controller/variacoes.controller';
import { Variacoes } from './entities/variacoe.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forFeature([Variacoes]),
  ] ,
  controllers: [VariacoesController],
  providers: [VariacoesService],
})
export class VariacoesModule {}