import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { MailService } from './mail.service';
import { VerificationCodeService } from './verification-code.service';
import { RedisService } from './redis.service';
import { MongooseModule } from '@nestjs/mongoose';
import {User, UserSchema} from './auth.schema'
import { JwtModule } from '@nestjs/jwt';
import { CacheService } from './cache.service';
require('dotenv').config();

@Module({
  imports: [
    MongooseModule.forFeature([{name: User.name, schema: UserSchema }]),
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '1h' },
    }),
  ],

  controllers: [AuthController],
  providers: [RedisService, AuthService, MailService, VerificationCodeService, CacheService]
})
export class AuthModule {}

