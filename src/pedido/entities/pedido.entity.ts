import { Entrega } from 'src/entrega/entities/entrega.entity';
import { Pagamento } from './../../pagamento/entities/pagamento.entity';
import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Cliente } from 'src/clientes/entities/cliente.entity';
import { Produto } from 'src/produto/entities/produto.entity';
import { Loja } from 'src/loja/entities/loja.entity';
import { Variacoes } from 'src/variacoes/entities/variacoe.entity';
import { RegistroPedido } from './registroPedido';

@Entity()
export class Pedido {
    @PrimaryGeneratedColumn()
    id: string;

    @Column()
    quantidade: number;

    @Column()
    precoUnitario: number;

    @Column({ default: false })
    cancelado: boolean;

    @ManyToOne(() => Cliente, cliente => cliente.pedidos)
    cliente: Cliente;

    @OneToOne(() => Pagamento, pagamento => pagamento.pedido)
    pagamento: Pagamento;

    @OneToOne(() => Entrega, entrega => entrega.pedido)
    entrega: Entrega;

    @OneToMany(()=> Produto, produtos => produtos.pedido)
    produtos: Produto[];

    @OneToMany(() => Variacoes, variacoes => variacoes.pedido)
    variacoes: Variacoes[];

    @ManyToOne(()=> Loja, loja => loja.pedidos)
    loja: Loja;

    @OneToMany(() => RegistroPedido, registroPedido => registroPedido.pedido)
    registros: RegistroPedido[];

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
