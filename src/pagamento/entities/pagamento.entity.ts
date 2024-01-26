import { Loja } from "src/loja/entities/loja.entity";
import { Pedido } from "src/pedido/entities/pedido.entity";
import { Entity, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Pagamento {
    @PrimaryGeneratedColumn()
    id: number;

    valor: number;

    formaPagamento: string;

    parcelado: boolean;

    status: string;

    @OneToOne(() => Pedido, pedido => pedido.pagamento)
    pedido: Pedido

    @ManyToOne(() => Loja, loja => loja.pagamentos)
    loja: Loja;
}
