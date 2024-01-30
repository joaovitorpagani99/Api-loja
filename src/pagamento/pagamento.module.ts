import { Module } from '@nestjs/common';
import { PagamentoService } from './service/pagamento.service';
import { PagamentoController } from './controller/pagamento.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Pagamento } from './entities/pagamento.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Pagamento]),

  ] ,
  controllers: [PagamentoController],
  providers: [PagamentoService],
  exports: [PagamentoService]
})
export class PagamentoModule {}
