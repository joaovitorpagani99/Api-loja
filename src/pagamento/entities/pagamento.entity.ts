import { Loja } from "src/loja/entities/loja.entity";
import { Pedido } from "src/pedido/entities/pedido.entity";
import { Column, Entity, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Pagamento {
    
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    valor: number;

    @Column({default: false})
    efetuado: boolean;

    @Column()
    formaPagamento: string;

    @Column()
    idCheckout: string;

    @Column()
    sandbox_init_point: string;
    
    @Column()
    init_point: string

    @OneToOne(() => Pedido, pedido => pedido.pagamento)
    pedido: Pedido

    @ManyToOne(() => Loja, loja => loja.pagamentos,{ onDelete: 'CASCADE' })
    loja: Loja;

    constructor(partical: Partial<Pagamento>){
        Object.assign(this, partical)
    }
    
}
