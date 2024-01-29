import { Entity, Column, ManyToOne, PrimaryGeneratedColumn, ManyToMany, OneToMany } from 'typeorm';
import { Produto } from 'src/produto/entities/produto.entity';
import { Variacoes } from 'src/variacoes/entities/variacoe.entity';
import { Pedido } from 'src/pedido/entities/pedido.entity';
import { Cliente } from 'src/clientes/entities/cliente.entity';

@Entity()
export class ItemCarrinho {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ default: 1 })
    quantidade: number;

    @Column()
    precoUnitario: number;

    @ManyToOne(() => Cliente, cliente => cliente.itensCarrinho, { onDelete: 'CASCADE' })
    cliente: Cliente;

    @ManyToOne(() => Produto, produto => produto.itensCarrinho, { onDelete: 'CASCADE' })
    produto: Produto;
    
    @ManyToOne(() => Variacoes, variacao => variacao.itensCarrinho, { onDelete: 'CASCADE' })
    variacao: Variacoes;

    @ManyToOne(() => Pedido, pedido => pedido.carrinho, { onDelete: 'CASCADE' })
    pedido: Pedido;

}