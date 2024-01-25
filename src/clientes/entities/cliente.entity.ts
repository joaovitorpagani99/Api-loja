import { Avaliacao } from "src/avaliacao/entities/avaliacao.entity";
import { Loja } from "src/loja/entities/loja.entity";
import { Pedido } from "src/pedido/entities/pedido.entity";
import { Role } from "src/usuario/Enum/role-enum";
import { Column, Entity, ManyToMany, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Cliente {

    @PrimaryGeneratedColumn()
    id: string;

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

}
