import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
@Entity()
export class Usuario {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    nome: String;
    
    @Column()
    email: String;
    
    @Column()
    loja: String;
    
    @Column()
    permissao: String;
}
