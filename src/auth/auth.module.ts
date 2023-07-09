import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { MailService } from './mail.service';
import { VerificationCodeService } from './verification-code.service';
import { RedisService } from './redis.service';
import { MongooseModule } from '@nestjs/mongoose';
import {User, UserSchema} from './auth.schema'
// require('dotenv').config();

@Module({
  imports: [MongooseModule.forFeature([{name: User.name, schema: UserSchema }])],
  controllers: [AuthController],
  providers: [RedisService, AuthService, MailService, VerificationCodeService]
})
export class AuthModule {}

