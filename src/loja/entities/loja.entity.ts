import { Entrega } from 'src/entrega/entities/entrega.entity';
import { Avaliacao } from 'src/avaliacao/entities/avaliacao.entity';
import { Categoria } from "src/categoria/entities/categoria.entity";
import { Cliente } from "src/clientes/entities/cliente.entity";
import { Pedido } from "src/pedido/entities/pedido.entity";
import { Produto } from 'src/produto/entities/produto.entity';
import { Usuario } from "src/usuario/entities/usuario.entity";
import { Column, Entity, ManyToMany, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
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

    @OneToMany(() => Produto, produto => produto.loja)
    produtos: Produto[];

    @OneToMany(() => Avaliacao, avaliacao => avaliacao.loja)
    avaliacoes: Avaliacao[];

    @OneToMany(() => Pedido, pedidos => pedidos.loja)
    pedidos: Pedido[];

    @ManyToOne(() => Usuario, usuario => usuario.loja)
    administrador: Usuario;

    @ManyToMany(() => Cliente, cliente => cliente.lojas)
    clientes: Cliente[];

    @OneToMany(() => Categoria, categoria => categoria.loja)
    categorias: Categoria[];

    @OneToOne(() => Entrega, entrega => entrega.loja)
    entrega: Entrega;

    @OneToMany(() => Pagamento, pagamento => pagamento.loja)
    pagamentos: Pagamento[];

}
