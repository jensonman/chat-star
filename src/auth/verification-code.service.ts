import { Injectable } from '@nestjs/common';
// import { MailService } from './mail.service';
import { createTransport } from 'nodemailer';
import { RedisService } from './redis.service';
import { CreateUserDto } from './dto/create-user.dto';
import { promisify } from 'util';
@Injectable()
export class VerificationCodeService {
  private transporter;
  
  constructor(private readonly redisService: RedisService) {
    // 连接邮箱
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
    const min = 100000;
    const max = 999999;
    const verificationCode = String(Math.floor(Math.random() * (max - min + 1)) + min);
    const verificationData = {
        verificationCode,
        lastRegistrationRequest: Date.now()
    }
    
    // 发送验证码到用户邮箱
    try{
        await this.sendVerificationEmail(toEmail, "主题：验证码", verificationCode);
        await this.redisService.set(toEmail, JSON.stringify(verificationData))
    }catch(error) {
        return '验证码发送失败，请重新发送';
    }

    return '验证码已发送，请查收邮件。';
  }

  
  async sendVerificationEmail(to: string, subject: string, verificationCode: string): Promise<void> {
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
      html: `
        <body style="font-family: Arial, sans-serif;">

        <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
            <h2 style="text-align: center;">Email Verification</h2>
            <p>Dear ${to},</p>
            <p>Thank you for registering with our platform. To complete your registration, please use the following verification code:</p>
            <p style="text-align: center; font-size: 24px; font-weight: bold;">${verificationCode}</p>
            <p>If you didn't register an account with us, you can ignore this email.</p>
        </div>

        </body>`,
    });
  }

  // 验证
  async verified(options: CreateUserDto){
    let message 
    await this.redisService.get(options.email).then((res: string) => {
        let data: any = JSON.parse(res) 
        if ( data.lastRegistrationRequest ) {
            const timeDiff = Date.now() - data.lastRegistrationRequest
            // 设置限制条件，例如每次注册请求之间至少需要间隔1分钟
            const registrationInterval = 60 * 1000; // 1分钟
            if (timeDiff < registrationInterval) {
                throw new Error('Registration requests are too frequent. Please try again later.');
            }
        }
        if (data && data.verificationCode === options.code) {
            message = "验证通过"
        }
    }).catch((error: Error) => {
        console.log(error)
        message = "验证不通过"
    })
    console.log(message)
    return message
  }
}
