import { Loja } from "src/loja/entities/loja.entity";
import { Role } from "src/usuario/Enum/role-enum";
import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from "typeorm";

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

    @ManyToMany(() => Loja, loja => loja.clientes)
    lojas: Loja[];

    @Column()
    endereco: string;
}
