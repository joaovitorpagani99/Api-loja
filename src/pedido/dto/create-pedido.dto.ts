import { IsBoolean, IsNumber, IsOptional } from 'class-validator';

export class CreatePedidoDto {
    @IsOptional()
    @IsBoolean()
    cancelado: boolean;

    @IsNumber()
    @IsOptional()
    clienteId: number;

    @IsNumber()
    @IsOptional()
    pagamentoId: number;

    @IsNumber()
    @IsOptional()
    entregaId: number;

    @IsNumber()
    @IsOptional()
    carrinhoId: number;

    @IsNumber()
    @IsOptional()
    lojaId: number;

    constructor(
        cancelado: boolean,
        clienteId: number,
        pagamentoId: number,
        entregaId: number,
        carrinhoId: number,
        lojaId: number
    ) {
        this.cancelado = cancelado;
        this.clienteId = clienteId;
        this.pagamentoId = pagamentoId;
        this.entregaId = entregaId;
        this.carrinhoId = carrinhoId;
        this.lojaId = lojaId;
    }
}