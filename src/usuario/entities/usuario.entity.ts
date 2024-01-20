import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
@Entity()
export class Usuario {

    @PrimaryGeneratedColumn('identity')
    id?: number;

    @Column()
    nome: string;
    
    @Column()
    email: string;

    @Column()
    senha: string;
    
    @Column()
    loja: string;
    
    @Column()
    permissao: string;
}
