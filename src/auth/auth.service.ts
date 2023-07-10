import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginDto } from './dto/login-user.dto';
import { User } from './auth.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { JwtService } from '@nestjs/jwt';
// import { MailService } from './mail.service';
import * as bcryptjs from 'bcryptjs'
@Injectable()
export class AuthService {
    constructor(
      private jwtService: JwtService,
      @InjectModel(User.name) private readonly userModel: Model<User>,
    ){}
    async register(createUserDto: CreateUserDto) {
        // 在这里实现用户注册逻辑，例如创建用户并保存到数据库
        const {email, password} = createUserDto
        
        const existingUser = await this.userModel.findOne({ email });
        if (existingUser) {
          throw new Error('该邮箱已被注册');
        }
    
        const saltRounds = 10;
        const hashedPassword = await bcryptjs.hashSync(password, saltRounds);

        const newUser = new this.userModel({ email, password: hashedPassword });
        await newUser.save();
        return newUser;
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
