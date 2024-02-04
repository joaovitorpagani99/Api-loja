import { Loja } from "src/loja/entities/loja.entity";
import { Pedido } from "src/pedido/entities/pedido.entity";
import { Column, CreateDateColumn, Entity, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { StatusEntrega } from "../enum/status-entrega.enum";

@Entity()
export class Entrega {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        type: 'enum',
        enum: StatusEntrega,
        default: StatusEntrega.AGUARDANDO_ENVIO
    })
    status: StatusEntrega;

    @Column()
    codigoRastreio: string;

    @Column()
    tipo: string;

    @Column()
    custo : number;
    
    @Column()
    dataPedido: Date;

    @Column()
    prazo: number;

    @Column()
    endereco: string;

    @OneToOne(()=> Pedido, pedido => pedido.entrega)
    pedido: Pedido;

    @OneToOne(()=> Loja, loja => loja.entrega)
    loja: Loja;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
