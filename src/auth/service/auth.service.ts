import { HttpException, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { Payload } from '../models/payload';
import { UsuarioService } from 'src/usuario/usuario.service';

@Injectable()
export class AuthService {

  constructor(
    private jwtService: JwtService,
    private usuarioService: UsuarioService,
  ) { }

  async signIn(email: string, senha: string) {
    const usuario = await this.usuarioService.findByEmail(email);
    const senhaValida = await this.compareSenhas(senha, usuario.senha);
    if (!senhaValida) {
      throw new UnauthorizedException();
    }
    return this.gerarToken(usuario);
  }

  private async gerarToken(user: any) {
    const payload: Payload = {
      username: user.nome,
      sub: user.id,
      email: user.email,
    };
    return await this.jwtService.signAsync(payload).then((token) => {
      return {
        access_token: token,
      };
    }).catch((err) => {
      throw err;
    });
  }

  async refresh(token: string) {
    try {
      const tokenDecode = await this.jwtService.verifyAsync(token);
      const payload = { email: tokenDecode.email, sub: tokenDecode.sub };
      return {
        access_token: this.jwtService.sign(payload),
      };
    } catch (error) {
      throw new HttpException('Token inválido', HttpStatus.BAD_REQUEST);
    }
  }

  async verificarToken(token: string) {
    return await this.jwtService.verifyAsync(token);
  }

  async hashSenha(password: string): Promise<string> {
    return await bcrypt.hash(password, 12);
  }

  async compareSenhas(senha: string, senhaHash: string): Promise<Boolean> {
    return await bcrypt.compare(senha, senhaHash);
  }

}
