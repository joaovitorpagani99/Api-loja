import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
    constructor(private mailerService: MailerService) {}

  getHello(): string {
    return 'Api ecommerce, desenvolvido por: Pagani';
  }

  async enviarEmail(email: string, mensagem: string) {
    await this.mailerService.sendMail({
      to: email,
      from: 'joaovitorpagani22@gmail.com',
      subject: 'Enviando Email com NestJS',
      html: `<h3 style="color: red">${mensagem}</h3>`,
    });
  }
}