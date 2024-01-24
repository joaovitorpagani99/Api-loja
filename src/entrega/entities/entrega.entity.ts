import { Pedido } from "src/pedido/entities/pedido.entity";
import { Entity, OneToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Entrega {
    @PrimaryGeneratedColumn()
    id: number;

    @OneToOne(()=> Pedido, pedido => pedido.entrega)
    pedido: Pedido;
}
