import { Entity, Column, ManyToOne, PrimaryGeneratedColumn, OneToOne, ManyToMany, OneToMany } from 'typeorm';
import { Produto } from 'src/produto/entities/produto.entity';
import { Variacoes } from 'src/variacoes/entities/variacoe.entity';
import { Pedido } from 'src/pedido/entities/pedido.entity';
import { Cliente } from 'src/clientes/entities/cliente.entity';

@Entity()
export class Carrinho {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ default: 1 })
    quantidade: number;

    @Column()
    precoUnitario: number;

    @ManyToOne(() => Cliente, cliente => cliente.carrinhos, { onDelete: 'CASCADE' })
    cliente: Cliente;

    @OneToMany(() => Variacoes, variacao => variacao.carrinho)
    variacoes: Variacoes[];

    @OneToOne(() => Pedido, pedido => pedido.carrinho, { onDelete: 'CASCADE' })
    pedido: Pedido;

}