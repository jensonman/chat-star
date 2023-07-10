import { RedisService } from './redis.service';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './auth.schema';
import { Model } from 'mongoose';
export declare class VerificationCodeService {
    private readonly redisService;
    private readonly userModel;
    private transporter;
    constructor(redisService: RedisService, userModel: Model<User>);
    generateVerificationCode(toEmail: string): Promise<object>;
    sendVerificationEmail(to: string, subject: string, verificationCode: string): Promise<void>;
    verified(options: CreateUserDto): Promise<any>;
}
