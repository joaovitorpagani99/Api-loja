import { Loja } from "src/loja/entities/loja.entity";
import { Produto } from "src/produto/entities/produto.entity";
import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Categoria {
    
    @PrimaryGeneratedColumn()
    id: number;
    
    @Column()
    nome: string;
    
    @Column({ unique: true})
    codigo: string;
    
    @Column()
    disponibilidade: boolean;

    @OneToMany(() => Produto, produto => produto.categoria, { cascade: true })
    produtos: Produto[];

    @ManyToOne(() => Loja, loja => loja.categorias,{ onDelete: 'CASCADE' })
    loja: Loja;
}
