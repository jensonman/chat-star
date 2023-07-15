import { Injectable } from '@nestjs/common';
// import { MailService } from './mail.service';
import { createTransport } from 'nodemailer';
import { RedisService } from './redis.service';
import { CreateUserDto } from './dto/create-user.dto';
import { promisify } from 'util';
import { User } from './auth.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { CacheService } from './cache.service';
import { Cron } from '@nestjs/schedule';
@Injectable()
export class VerificationCodeService {
  private transporter;
  
  constructor(
    // private readonly redisService: RedisService,
    private readonly cacheService: CacheService,
    @InjectModel(User.name) private readonly userModel: Model<User>
    ) {
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

  async generateVerificationCode(toEmail: string): Promise<object> {
    // 生成验证码的逻辑，可以使用随机数生成库生成随机验证码
    const min = 100000;
    const max = 999999;
    const verificationCode = String(Math.floor(Math.random() * (max - min + 1)) + min);
    const verificationData = {
        verificationCode,
        lastRegistrationRequest: Date.now()
    }
    // 验证码过期时间
    const codeExpireTime = 60
    
    // 该邮箱是否已被注册
    const existingUser = await this.userModel.find({ "email":toEmail });
    if (existingUser.length !== 0) {
      return {
        success: false,
        data: {
          message: "该邮箱已注册！"
        }
      }
      // throw new Error('该邮箱已被注册');
    }
    // 发送验证码到用户邮箱
    try{
      this.saveData(toEmail, verificationCode, codeExpireTime)
      // 是否设置成功
      let getData = this.getData(toEmail)
      if(getData){
        await this.sendVerificationEmail(toEmail, "主题：验证码", verificationCode);
      }
        
    }catch(error) {
        return {
            success: false,
            data: {
              message: "验证码发送失败，请重新发送"
            }
        }
    }

    return {
        success: true,
        data: {
          message: "验证码已发送到该邮箱，请查收"
        }
    }
  }
  // 内存缓存
  saveData(key: string, value: any, expiration: number) {
    this.cacheService.set(key, value, expiration);
  }
  // 获取内存缓存数据
  getData(key: string) {
    return this.cacheService.get(key);
  }
  // 定时清理缓存
  @Cron('0 * * * * *') // 每分钟的第0秒执行
  cleanExpiredData() {
    this.cacheService.cleanExpiredData();
  }
// 验证码使用redis的方法保存，但是由于云服务内存实在不够，只能改用mongodb
  // async generateVerificationCode(toEmail: string): Promise<object> {
  //   // 生成验证码的逻辑，可以使用随机数生成库生成随机验证码
  //   const min = 100000;
  //   const max = 999999;
  //   const verificationCode = String(Math.floor(Math.random() * (max - min + 1)) + min);
  //   const verificationData = {
  //       verificationCode,
  //       lastRegistrationRequest: Date.now()
  //   }
  //   // 验证码过期时间
  //   const codeExpireTime = 60
    
  //   // 该邮箱是否已被注册
  //   const existingUser = await this.userModel.find({ "email":toEmail });
  //   if (existingUser.length !== 0) {
  //     return {
  //       success: false,
  //       data: {
  //         message: "该邮箱已注册！"
  //       }
  //     }
  //     // throw new Error('该邮箱已被注册');
  //   }
  //   // 发送验证码到用户邮箱
  //   try{
  //     await this.redisService.set(toEmail, JSON.stringify(verificationData))
  //     this.redisService.client.expire(toEmail, codeExpireTime)
  //     await this.sendVerificationEmail(toEmail, "主题：验证码", verificationCode);
        
  //   }catch(error) {
  //       return {
  //           success: false,
  //           data: {
  //             message: "验证码发送失败，请重新发送"
  //           }
  //       }
  //   }

  //   return {
  //       success: true,
  //       data: {
  //         message: "验证码已发送到该邮箱，请查收"
  //       }
  //   }
  // }

  
  async sendVerificationEmail(to: string, subject: string, verificationCode: string): Promise<Array<string>> {
    // 邮件服务器准备
    this.transporter.verify(function (error, success) {
        if (error) {
        console.log(error)
        }else{
        console.log('email is ready')
        }
    })
    // console.log("---this.transporter:", this.transporter)
    let mailRes = await this.transporter.sendMail({
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
    return mailRes.accepted
  }

  async verified(options: CreateUserDto){
    let message 
    let res = this.getData(options.email)
    if (res === options.code) {
        message = "验证通过"
    }else {
      message = "验证不通过"
    }
    console.log(message)
    return message
  }
  // 验证 ==== redis逻辑
  // async verified(options: CreateUserDto){
  //   let message 
  //   await this.redisService.get(options.email).then((res: string) => {
  //       let data: any = JSON.parse(res) 
  //       if ( data.lastRegistrationRequest ) {
  //           const timeDiff = Date.now() - data.lastRegistrationRequest
  //           // 设置限制条件，例如每次注册请求之间至少需要间隔1分钟
  //           const registrationInterval = 60 * 1000; // 1分钟
  //           if (timeDiff < registrationInterval) {
  //               throw new Error('Registration requests are too frequent. Please try again later.');
  //           }
  //       }
  //       if (data && data.verificationCode === options.code) {
  //           message = "验证通过"
  //       }
  //   }).catch((error: Error) => {
  //       console.log(error)
  //       message = "验证不通过"
  //   })
  //   console.log(message)
  //   return message
  // }
}
