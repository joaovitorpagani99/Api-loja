import { Column, Entity, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Categoria } from "src/categoria/entities/categoria.entity";
import {  Variacoes } from 'src/variacoes/entities/variacoe.entity';
import { Avaliacao } from 'src/avaliacao/entities/avaliacao.entity';
import { Pedido } from 'src/pedido/entities/pedido.entity';
import { Loja } from 'src/loja/entities/loja.entity';
import { ItemCarrinho } from 'src/carrinho/entities/carrinho.entity';

@Entity()
export class Produto {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    titulo: string;

    @Column()
    disponibilidade: boolean;

    @Column()
    descricao: string;

    @Column({ nullable: true })
    foto: string;

    @Column()
    preco: number;

    @Column()
    promocao: number;

    @Column()
    sku: string;
     
    @ManyToOne(() => Categoria, categoria => categoria.produtos, {
        onDelete: 'CASCADE'
    })
    categoria: Categoria;
    
    @ManyToOne(() => Loja, loja => loja.produtos, {
        onDelete: 'CASCADE'
      })
    loja: Loja;

    @OneToMany(() => Variacoes, variacoes => variacoes.produto)    
    variacoes: Variacoes[];

    @OneToMany(() => Avaliacao, avaliacao => avaliacao.produto)
    avaliacoes: Avaliacao[];

    @OneToMany(() => ItemCarrinho, itemCarrinho => itemCarrinho.produto)
    itensCarrinho: ItemCarrinho[];
}
 