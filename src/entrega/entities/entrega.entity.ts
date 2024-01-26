import { Loja } from "src/loja/entities/loja.entity";
import { Pedido } from "src/pedido/entities/pedido.entity";
import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Entrega {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    status: string;

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

    @OneToOne(()=> Pedido, pedido => pedido.entrega)
    pedido: Pedido;

    @OneToOne(()=> Loja, loja => loja.entrega)
    loja: Loja;
}
