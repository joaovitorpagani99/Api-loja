import { Produto } from "src/produto/entities/produto.entity";
import { Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Variacoes {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Produto, produto => produto.variacoes)
    produto: Produto;
}
