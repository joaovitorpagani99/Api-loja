import { Entrega } from 'src/entrega/entities/entrega.entity';
import { Avaliacao } from 'src/avaliacao/entities/avaliacao.entity';
import { Categoria } from 'src/categoria/entities/categoria.entity';
import { Cliente } from 'src/clientes/entities/cliente.entity';
import { Pedido } from 'src/pedido/entities/pedido.entity';
import { Produto } from 'src/produto/entities/produto.entity';
import { Usuario } from 'src/usuario/entities/usuario.entity';
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Pagamento } from 'src/pagamento/entities/pagamento.entity';

@Entity()
export class Loja {

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nome: string;

  @Column()
  cnpj: string;

  @Column()
  email: string;

  @Column()
  telefone: string;

  @Column()
  endereco: string;

  @OneToMany(() => Produto, (produto) => produto.loja, { cascade: true })
  produtos: Produto[];

  @OneToMany(() => Avaliacao, (avaliacao) => avaliacao.loja, { cascade: true })
  avaliacoes: Avaliacao[];

  @OneToMany(() => Pedido, (pedidos) => pedidos.loja, { cascade: true })
  pedidos: Pedido[];

  @ManyToOne(() => Usuario, usuario => usuario.lojas, { cascade: true })
  administrador: Usuario;

  @ManyToMany(() => Cliente, (cliente) => cliente.lojas, { cascade: true })
  @JoinTable()
  clientes: Cliente[];

  @OneToMany(() => Categoria, (categoria) => categoria.loja, { cascade: true })
  categorias: Categoria[];

  @OneToOne(() => Entrega, (entrega) => entrega.loja, { cascade: true })
  entrega: Entrega;

  @OneToMany(() => Pagamento, (pagamento) => pagamento.loja, { cascade: true })
  pagamentos: Pagamento[];
}
