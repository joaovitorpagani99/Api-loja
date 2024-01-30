import { Avaliacao } from "src/avaliacao/entities/avaliacao.entity";
import { Carrinho } from "src/carrinho/entities/carrinho.entity";
import { Loja } from "src/loja/entities/loja.entity";
import { Pedido } from "src/pedido/entities/pedido.entity";
import { Role } from "src/usuario/Enum/role-enum";
import { Column, Entity, ManyToMany, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Cliente {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    nome: string;

    @Column()
    dataDeNascimento: Date;

    @Column()
    cpf: string;

    @Column()
    email: string;

    @Column()
    telefone: string;

    @Column()
    deletado: boolean;

    @Column()
    permissao: Role;

    @Column()
    endereco: string;

    @ManyToMany(() => Loja, loja => loja.clientes)
    lojas: Loja[];

    @OneToMany(()=> Pedido, pedidos => pedidos.cliente)
    pedidos: Pedido[];

    @OneToMany(()=> Carrinho, carrinhos => carrinhos.cliente)
    carrinhos: Carrinho[];

}
