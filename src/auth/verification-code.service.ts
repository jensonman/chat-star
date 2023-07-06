import { Injectable } from '@nestjs/common';
// import { MailService } from './mail.service';
import { createTransport } from 'nodemailer';

@Injectable()
export class VerificationCodeService {
  private transporter;

  constructor() {
    this.transporter = createTransport({
        host: 'smtp.163.com',
        port: 465,
        secure: true,
        auth: {
            user: 'wecode2old@163.com',
            pass: 'FVFNAGUQODNXLBSR',
        },
    });
  }

  async generateVerificationCode(toEmail: string): Promise<string> {
    // 生成验证码的逻辑，可以使用随机数生成库生成随机验证码
    const verificationCode = 'generate-your-verification-code-here';
    console.log("-----test-----", toEmail)
    // 发送验证码到用户邮箱
    await this.sendVerificationEmail(toEmail, "主题：验证码", "code:"+verificationCode);

    return '验证码已发送，请查收邮件。';
  }

  
  async sendVerificationEmail(to: string, subject: string, body: string): Promise<void> {
    // 邮件服务器准备
    this.transporter.verify(function (error, success) {
        if (error) {
        console.log(error)
        }else{
        console.log('email is ready')
        }
    })
    // console.log("---this.transporter:", this.transporter)
    await this.transporter.sendMail({
      from: 'wecode2old@163.com',
      to,
      subject,
      text: body,
    });
  }
}
