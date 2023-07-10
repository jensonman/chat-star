import { CreateUserDto } from './dto/create-user.dto';
import { LoginDto } from './dto/login-user.dto';
import { User } from './auth.schema';
import { Model } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import { RedisService } from './redis.service';
import { VerificationCodeService } from './verification-code.service';
export declare class AuthService {
    private jwtService;
    private readonly redisService;
    private readonly verificationCodeService;
    private readonly userModel;
    constructor(jwtService: JwtService, redisService: RedisService, verificationCodeService: VerificationCodeService, userModel: Model<User>);
    register(createUserDto: CreateUserDto): Promise<{
        success: boolean;
        data: {
            message: string;
        };
    }>;
    login(loginDto: LoginDto): Promise<{
        code: number;
        success: boolean;
        data: {
            message: string;
        };
    } | {
        access_token: string;
        code: number;
        success: boolean;
        data: {
            message: string;
        };
    }>;
}
