import { Pedido } from "src/pedido/entities/pedido.entity";
import { Produto } from "src/produto/entities/produto.entity";
import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Imagem } from "./imagem.entity";
import { ItemCarrinho } from "src/carrinho/entities/carrinho.entity";

@Entity()
export class Variacoes {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    nome: string;

    @Column()
    preco: number;

    @Column()
    promocao: number;

    @Column()
    entrega: string;

    @ManyToOne(() => Produto, produto => produto.variacoes, { onDelete: 'CASCADE' })
    produto: Produto;

    @OneToMany(() => Imagem, imagem => imagem.variacoes)
    imagens: Imagem[];

    @OneToMany(() => ItemCarrinho, itemCarrinho => itemCarrinho.variacao)
    itensCarrinho: ItemCarrinho[];

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
