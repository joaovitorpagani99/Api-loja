import { Request } from 'express';
import { Usuario } from 'src/usuario/entities/usuario.entity';

export interface AuthRequest extends Request {
  username: string;
  senha: string;
}