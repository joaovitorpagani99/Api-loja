import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import * as crypto from "crypto";
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
    loja: string;
    
    @Column()
    permissao: Role;
    
    @Column({ nullable: true })
    recoveryToken: string;
  
    @Column({ nullable: true })
    recoveryDate: Date;

    @Column({ nullable: true, type: 'varchar', length: 64 })
    confirmationToken: string;

  
    @CreateDateColumn()
    createdAt: Date;
  
    @UpdateDateColumn()
    updatedAt: Date;

    criarTokenRecuperacaoSenha = function(){
        this.recoveryToken = crypto.randomBytes(16).toString("hex");
        this.recoveryDate = new Date( new Date().getTime() + 24*60*60*1000 );
        return { token: this.recoveryToken, date: this.recoveryDate };
    };
    
    finalizarTokenRecuperacaoSenha = function(){
        this.recoveryToken = null;
        this.recoveryDate = null;
        return { token: this.recoveryToken, date: this.recoveryDate };
    };
    
}
