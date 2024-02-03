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

    @Column({default: 1})
    parcelas: number;

    @Column()
    status: string;

    @Column()
    enderecoEntregaIgualCobrancao: boolean;

    @Column()
    pagSeguroCode: string;

    @OneToOne(() => Pedido, pedido => pedido.pagamento)
    pedido: Pedido

    @ManyToOne(() => Loja, loja => loja.pagamentos,{ onDelete: 'CASCADE' })
    loja: Loja;

    constructor(){
        
    }
}
