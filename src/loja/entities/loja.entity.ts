import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

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
}
