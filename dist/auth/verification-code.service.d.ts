import { RedisService } from './redis.service';
import { CreateUserDto } from './dto/create-user.dto';
export declare class VerificationCodeService {
    private readonly redisService;
    private transporter;
    constructor(redisService: RedisService);
    generateVerificationCode(toEmail: string): Promise<string>;
    sendVerificationEmail(to: string, subject: string, verificationCode: string): Promise<void>;
    verified(options: CreateUserDto): Promise<any>;
}
