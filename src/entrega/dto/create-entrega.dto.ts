import { IsEnum, IsNumber, IsOptional, IsString } from "class-validator";
import { StatusEntrega } from "../enum/status-entrega.enum";

export class CreateEntregaDto {

    @IsEnum(StatusEntrega)
    status: StatusEntrega;

    @IsString()
    codigoRastreio: string;

    @IsString()
    tipo: string;

    @IsNumber()
    custo: number;

    @IsOptional()
    @IsNumber()
    prazo: number;

    @IsNumber()
    pedidoId: number;

    @IsNumber()
    lojaId: number;

    constructor(
        status: StatusEntrega,
        codigoRastreio: string,
        tipo: string,
        custo: number,
        prazo: number,
        pedidoId: number,
        lojaId: number
    ) {
        this.status = status;
        this.codigoRastreio = codigoRastreio;
        this.tipo = tipo;
        this.custo = custo;
        this.prazo = prazo;
        this.pedidoId = pedidoId;
        this.lojaId = lojaId;
    }
}
