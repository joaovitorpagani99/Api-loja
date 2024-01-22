import { Usuario } from 'src/usuario/entities/usuario.entity';
export class ResponseLoja {
    id: number;
    nome?: string;
    endereco?: string;
    telefone?: string;
    email?: string;
    cnpj?: string;
    usuario?: Usuario;
}