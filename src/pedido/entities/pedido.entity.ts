import { Entrega } from 'src/entrega/entities/entrega.entity';
import { Pagamento } from './../../pagamento/entities/pagamento.entity';
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Cliente } from 'src/clientes/entities/cliente.entity';
import { Loja } from 'src/loja/entities/loja.entity';
import { RegistroPedido } from './registroPedido';
import { Carrinho } from 'src/carrinho/entities/carrinho.entity';

@Entity()
export class Pedido {

    @PrimaryGeneratedColumn()
    id: string;

    @Column({ default: false })
    cancelado: boolean;

    @Column({ nullable: true })
    mensagemCancelamento: string;

    @ManyToOne(() => Cliente, cliente => cliente.pedidos, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'clienteId' })
    cliente: Cliente;

    @OneToOne(() => Pagamento, pagamento => pagamento.pedido)
    @JoinColumn({ name: 'pagamentoId' })
    pagamento: Pagamento;

    @OneToOne(() => Entrega, entrega => entrega.pedido)
    @JoinColumn({ name: 'entregaId' })
    entrega: Entrega;

    @ManyToOne(() => Carrinho, carrinho => carrinho.pedido, { onDelete: 'CASCADE' })
    carrinho: Carrinho;

    @ManyToOne(() => Loja, loja => loja.pedidos, { onDelete: 'CASCADE' })
    loja: Loja;


    //@OneToMany(() => RegistroPedido, registroPedido => registroPedido.pedido)
    //registros: RegistroPedido[];

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    constructor(partial: Partial<Pedido>) {
        Object.assign(this, partial);
    }
}
