import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { UsuarioModule } from './usuario/usuario.module';
import { Usuario } from './usuario/entities/usuario.entity';
import { AuthModule } from './auth/auth.module';
import { LojaModule } from './loja/loja.module';
import { Loja } from './loja/entities/loja.entity';
import { ClientesModule } from './clientes/clientes.module';
import { Cliente } from './clientes/entities/cliente.entity';
import { PedidoModule } from './pedido/pedido.module';
import { PagamentoModule } from './pagamento/pagamento.module';
import { ProdutoModule } from './produto/produto.module';
import { CategoriaModule } from './categoria/categoria.module';
import { AvaliacaoModule } from './avaliacao/avaliacao.module';
import { Categoria } from './categoria/entities/categoria.entity';
import { Pagamento } from './pagamento/entities/pagamento.entity';
import { Pedido } from './pedido/entities/pedido.entity';
import { VariacoesModule } from './variacoes/variacoes.module';
import { EntregaModule } from './entrega/entrega.module';
import { Avaliacao } from './avaliacao/entities/avaliacao.entity';
import { Entrega } from './entrega/entities/entrega.entity';
import { Produto } from './produto/entities/produto.entity';
import { Variacoes } from './variacoes/entities/variacoe.entity';
import { RegistroPedido } from './pedido/entities/registroPedido';
import { Imagem } from './variacoes/entities/imagem.entity';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      entities: [
        Usuario, Loja, Cliente, Categoria, Pagamento, Pedido, Avaliacao, Entrega, Produto, Variacoes, RegistroPedido,Imagem
      ],
      synchronize: true,
      keepConnectionAlive: true,
      extra: {
        trustServerCertificate: true,
        Encrypt: true,
        IntegratedSecurity: false,
      },
    }),
    AuthModule,
    UsuarioModule,
    LojaModule,
    ClientesModule,
    CategoriaModule, 
    ProdutoModule,
    PedidoModule,
    PagamentoModule,
    AvaliacaoModule,
    VariacoesModule,
    EntregaModule,
  ],
  controllers: [AppController],
})
export class AppModule { }
