import { Loja } from "src/loja/entities/loja.entity";
import { Produto } from "src/produto/entities/produto.entity";
import { Column, Entity, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Avaliacao {    
    
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    nome: string;

    @Column()
    texto: string;

    @Column({default: 1})
    pontuacao: number;

    @ManyToOne(()=> Produto, produto => produto.avaliacoes)
    produto: Produto;

    @ManyToOne(() => Loja, loja => loja.avaliacoes)
    loja: Loja;

}
