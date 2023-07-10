import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginDto } from './dto/login-user.dto';
import { VerificationCodeService } from './verification-code.service';
export declare class AuthController {
    private readonly authService;
    private readonly verificationCodeService;
    constructor(authService: AuthService, verificationCodeService: VerificationCodeService);
    verificationCode(createUserDto: CreateUserDto): Promise<any>;
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
