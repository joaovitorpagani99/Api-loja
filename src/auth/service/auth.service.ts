import { CreateUsuarioDto } from './../../usuario/dto/create-usuario.dto';
import { BadRequestException, HttpException, HttpStatus, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { Payload } from '../models/payload';
import { UsuarioService } from 'src/usuario/service/usuario.service';
import { Usuario } from 'src/usuario/entities/usuario.entity';

@Injectable()
export class AuthService {
  

  constructor(
    private jwtService: JwtService,
    private usuarioService: UsuarioService,
  ) { }

  async signIn(email: string, senha: string) {
    const usuario = await this.usuarioService.findByEmail(email);
    const senhaValida = await this.compareSenhas(senha, usuario.senha);
    console.log(senhaValida);
    if (!senhaValida) {
      throw new UnauthorizedException();
    }
    return this.gerarToken(usuario);
  }

  async signUp(createUserDto: CreateUsuarioDto): Promise<Usuario> {
      const user = await this.usuarioService.create(createUserDto);
      const mail = {
        to: user.email,
        from: 'noreply@application.com',
        subject: 'Email de confirmação',
        template: 'email-confirmation',
        context: {
          token: user.confirmationToken,
        },
      };
      //await this.mailerService.sendMail(mail);
      return user;
    }

    async createRecovery(email: string) {
      if (!email) {
        throw new BadRequestException('Preencha com o seu email');
      }
    
      const usuario: Usuario = await this.usuarioService.findByEmail(email);
      if (!usuario) {
        throw new NotFoundException('Não existe usuário com este email');
      }
    
      const recoveryData = usuario.criarTokenRecuperacaoSenha();
       this.usuarioService.create(usuario);
    
      const mail = {
        to: usuario.email,
        from: 'noreply@application.com',
        subject: 'Recuperação de senha',
        template: 'recovery',
        context: {
          token: recoveryData,
        },
      };
       //this.mailerService.sendMail(mail);
    
      return { message: 'E-mail de recuperação de senha enviado.' };
    }

  private async gerarToken(user: any) {
    const payload: Payload = {
      username: user.nome,
      sub: user.id,
      email: user.email,
      role: user.permissao,
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
