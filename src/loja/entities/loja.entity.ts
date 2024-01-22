import { Cliente } from "src/clientes/entities/cliente.entity";
import { Usuario } from "src/usuario/entities/usuario.entity";
import { Column, Entity, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Loja {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    nome: string;

    @Column()
    cnpj: string;

    @Column()
    email: string;

    @Column()
    telefone: string;

    @Column()
    endereco: string;

    @ManyToOne(() => Usuario, usuario => usuario.loja)
    administrador: Usuario;

    @ManyToMany(() => Cliente, cliente => cliente.lojas)
    clientes: Cliente[];
}
