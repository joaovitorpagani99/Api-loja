import { Pedido } from "src/pedido/entities/pedido.entity";
import { Entity, OneToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Pagamento {
    @PrimaryGeneratedColumn()
    id: number;

    @OneToOne(()=> Pedido, pedido => pedido.pagamento)
    pedido: Pedido
}
