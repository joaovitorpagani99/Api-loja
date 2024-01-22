import { Loja } from "src/loja/entities/loja.entity";
import { Role } from "../Enum/role-enum";

export class ResponseUsuario {
    id: number;
    nome?: string;
    email?: string;
    senha?: string;
    idade?: Number;
    loja?: Loja;
    permissao?: Role;

}