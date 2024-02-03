import { Loja } from 'src/loja/entities/loja.entity';
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Role } from "../Enum/role-enum";
@Entity()
export class Usuario {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    nome: string;

    @Column({ unique: false })
    email: string;

    @Column()
    senha: string;

    @Column()
    permissao: Role;

    @Column({ nullable: true })
    recoveryToken: string;

    @Column({ nullable: true })
    recoveryDate: Date;

    @Column({ nullable: true, type: 'varchar', length: 64 })
    confirmationToken: string;

    @ManyToOne(() => Loja, loja => loja.administrador)
    loja: Loja[];


    @CreateDateColumn({ nullable: true })
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
