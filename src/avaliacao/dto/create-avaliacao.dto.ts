import { IsNumber, IsString } from 'class-validator';
export class CreateAvaliacaoDto {
    
    @IsString()
    nome: string;
    
    @IsString()
    texto: string;
    
    @IsNumber()
    pontuacao: number = 1;
    
    @IsNumber()
    idProduto: number;
}
