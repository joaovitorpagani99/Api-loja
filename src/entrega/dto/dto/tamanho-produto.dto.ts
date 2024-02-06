import { Variacoes } from "src/variacoes/entities/variacoe.entity";

export class TamanhoProdutoDto {
    peso: number;
    comprimento: number;
    altura: number;
    largura: number;
    
    constructor(variacoes: Variacoes) {
        this.peso = variacoes.pesoKg;
        this.altura = variacoes.alturaCm;
        this.largura = variacoes.larguraCm;
        this.comprimento = variacoes.comprimento;
    }
}