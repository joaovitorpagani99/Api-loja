import { Cliente } from "src/clientes/entities/cliente.entity";
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

    @Column()
    pontuacao: number = 1;

    @ManyToOne(()=> Produto, produto => produto.avaliacoes)
    produto: Produto;

    @OneToOne(() => Loja, loja => loja.avaliacao)
    loja: Loja;

    @ManyToOne(()=> Cliente, cliente => cliente.avaliacoes)
    cliente: Cliente;
}
