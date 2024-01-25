import { Produto } from "src/produto/entities/produto.entity";
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

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

    fotos: string[];

    @Column()
    entrega: string;

    @ManyToOne(() => Produto, produto => produto.variacoes)
    produto: Produto;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
