import { Module, forwardRef } from '@nestjs/common';
import { PagamentoService } from './service/pagamento.service';
import { PagamentoController } from './controller/pagamento.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Pagamento } from './entities/pagamento.entity';
import { LojaModule } from 'src/loja/loja.module';
import { PedidoModule } from 'src/pedido/pedido.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Pagamento]),
    forwardRef(() => PedidoModule), 
    LojaModule
  ] ,
  controllers: [PagamentoController],
  providers: [PagamentoService],
  exports: [PagamentoService]
})
export class PagamentoModule {}
