import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginDto } from './dto/login-user.dto';
import { User } from './auth.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { JwtService } from '@nestjs/jwt';
// import { RedisService } from './redis.service';
import { promisify } from 'util';
// import { MailService } from './mail.service';
import * as bcryptjs from 'bcryptjs'
import { VerificationCodeService } from './verification-code.service';

@Injectable()
export class AuthService {
    constructor(
      private jwtService: JwtService,
      // private readonly redisService: RedisService,
      private readonly verificationCodeService: VerificationCodeService, 
      @InjectModel(User.name) private readonly userModel: Model<User>,
    ){}
    async register(createUserDto: CreateUserDto) {
        // 在这里实现用户注册逻辑，例如创建用户并保存到数据库
        const {email, password, code} = createUserDto
        
        const existingUser = await this.userModel.findOne({ email });
        // 验证邮箱
        if (existingUser) {
          return {
            success: false,
            data: {
              message: "该邮箱已注册！"
            }
          }
          // throw new Error('该邮箱已被注册');
        }
        // 检查验证码
        if(code) {
          // let getCode = await this.redisService.get(email)
          let resCode = this.verificationCodeService.getData(email)

          if (code !== resCode) {
            return {
              success: false,
              data: {
                message: "请输入正确的验证码！"
              }
            }
          }

        }else {
          return {
            success: false,
            data: {
              message: "请输入正确的验证码！"
            }
          }
        }
    
        const saltRounds = 10;
        const hashedPassword = await bcryptjs.hashSync(password, saltRounds);

        const newUser = new this.userModel({ email, password: hashedPassword });
        await newUser.save();
        return {
          data:{
            message: "message: 注册成功"
          },
          success: true
        };
    }

    async login(loginDto: LoginDto) {
        const {email, password} = loginDto
        const res = {
          code: 999,
          success: false,
          data: {
            message:''
          }
        }
        console.log("---loginDto:", loginDto)
        const user = await this.userModel.findOne({email});
        if (!user) {
          // throw new Error('用户不存在');
          res.data.message = '用户不存在'
          return res
        }
    
        const isPasswordMatch = await bcryptjs.compareSync(password, user.password);
        if (!isPasswordMatch) {
          // throw new Error('密码不正确');
          res.data.message = '密码不正确'
          return res
        }
    
        // 进行登录逻辑...
        Object.assign(res, {
          code: 200,
          success: true,
          data: {}
        })
        return {...res,access_token: await this.jwtService.signAsync({email})}
        // return {res, token:this.jwtService.sign(email)};
    }

    // async validateToken(token: string): Promise<any> {
    //   try {
    //     return this.jwtService.verify(token);
    //   } catch (error) {
    //     throw new Error('Invalid token');
    //   }
    // }
}
