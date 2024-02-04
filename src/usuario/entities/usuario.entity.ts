import { Loja } from 'src/loja/entities/loja.entity';
import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Role } from "../Enum/role-enum";
@Entity()
export class Usuario {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    nome: string;

    @Column()
    email: string;

    @Column()
    senha: string;

    @Column()
    permissao: Role;

    @Column()
    cliente: boolean;

    @Column()
    recoveryToken: string;

    @Column()
    recoveryDate: Date;

    @Column()
    confirmationToken: string;

    @OneToMany(() => Loja, loja => loja.administrador)
    lojas: Loja[];


    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    /*criarTokenRecuperacaoSenha = function () {
        this.recoveryToken = crypto.randomBytes(16).toString("hex");
        this.recoveryDate = new Date(new Date().getTime() + 24 * 60 * 60 * 1000);
        return { token: this.recoveryToken, date: this.recoveryDate };
    };

    finalizarTokenRecuperacaoSenha = function () {
        this.recoveryToken = null;
        this.recoveryDate = null;
        return { token: this.recoveryToken, date: this.recoveryDate };
    };*/

}
