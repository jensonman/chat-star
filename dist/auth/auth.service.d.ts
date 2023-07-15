import { CreateUserDto } from './dto/create-user.dto';
import { LoginDto } from './dto/login-user.dto';
import { User } from './auth.schema';
import { Model } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import { VerificationCodeService } from './verification-code.service';
export declare class AuthService {
    private jwtService;
    private readonly verificationCodeService;
    private readonly userModel;
    constructor(jwtService: JwtService, verificationCodeService: VerificationCodeService, userModel: Model<User>);
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
