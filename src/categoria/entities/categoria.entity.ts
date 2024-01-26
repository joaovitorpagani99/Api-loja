import { Loja } from "src/loja/entities/loja.entity";
import { Produto } from "src/produto/entities/produto.entity";
import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Categoria {
    @PrimaryGeneratedColumn()
    id: number;
    @Column()
    nome: string;
    @Column()
    codigo: string;
    @Column()
    disponibilidade: boolean;

    @OneToMany(() => Produto, produto => produto.categoria)
    produtos: Produto[];

    @ManyToOne(() => Loja, loja => loja.categorias,{ onDelete: 'CASCADE' })
    loja: Loja;
}
