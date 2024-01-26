import { Loja } from "src/loja/entities/loja.entity";
import { Pedido } from "src/pedido/entities/pedido.entity";
import { Column, Entity, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Pagamento {
    
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    valor: number;

    @Column()
    formaPagamento: string;

    @Column()
    parcelado: string;

    @Column()
    status: string;

    @OneToOne(() => Pedido, pedido => pedido.pagamento)
    pedido: Pedido

    @ManyToOne(() => Loja, loja => loja.pagamentos)
    loja: Loja;
}
