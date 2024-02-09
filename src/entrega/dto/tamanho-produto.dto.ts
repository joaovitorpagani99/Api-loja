import { Variacoes } from "src/variacoes/entities/variacoe.entity";

export class TamanhoProdutoDto {
    peso: number;
    comprimento: number;
    altura: number;
    largura: number;
    
    constructor(peso: number, comprimento: number, altura: number, largura: number) {
        this.peso = peso;
        this.altura = altura;
        this.largura = largura;
        this.comprimento = comprimento;
    }
}