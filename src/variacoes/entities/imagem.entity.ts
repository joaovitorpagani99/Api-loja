import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Variacoes } from "./variacoe.entity";

@Entity()
export class Imagem {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  url: string;

  @ManyToOne(() => Variacoes, variacoes => variacoes.imagens, { onDelete: 'CASCADE' })
  variacoes: Variacoes;
}
