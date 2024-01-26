import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Pedido } from "./pedido.entity";

@Entity()
export class RegistroPedido {

    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Pedido, pedido => pedido.registros)
    pedido: Pedido;

    @Column()
    tipo: string;

    @Column()
    situacao: string;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    data: Date;
}