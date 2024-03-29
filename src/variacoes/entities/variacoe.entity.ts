import { Produto } from "src/produto/entities/produto.entity";
import { Column, CreateDateColumn, Entity, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Imagem } from "./imagem.entity";
import { Carrinho } from "src/carrinho/entities/carrinho.entity";

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
    alturaCm: number;
    
    @Column()
    larguraCm: number;
    
    @Column()
    comprimento: number;

    @Column()
    pesoKg: number;

    @Column()
    freteGratis: boolean;

    @ManyToOne(() => Produto, produto => produto.variacoes, { onDelete: 'CASCADE' })
    produto: Produto;

    @OneToMany(() => Imagem, imagem => imagem.variacoes)
    imagens: Imagem[];

    @ManyToOne(() => Carrinho, carrinho => carrinho.variacoes, { onDelete: 'CASCADE' })
    carrinho: Carrinho;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
