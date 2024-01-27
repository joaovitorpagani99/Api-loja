import { Pedido } from "src/pedido/entities/pedido.entity";
import { Produto } from "src/produto/entities/produto.entity";
import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Imagem } from "./imagem.entity";

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

    @ManyToOne(() => Pedido, pedido => pedido.variacoes, { onDelete: 'CASCADE' })
    pedido: Pedido;
    
    @OneToMany(() => Imagem, imagem => imagem.variacoes)
    imagens: Imagem[];

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
