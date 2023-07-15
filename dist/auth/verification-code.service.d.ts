import { CreateUserDto } from './dto/create-user.dto';
import { User } from './auth.schema';
import { Model } from 'mongoose';
import { CacheService } from './cache.service';
export declare class VerificationCodeService {
    private readonly cacheService;
    private readonly userModel;
    private transporter;
    constructor(cacheService: CacheService, userModel: Model<User>);
    generateVerificationCode(toEmail: string): Promise<object>;
    saveData(key: string, value: any, expiration: number): void;
    getData(key: string): any;
    cleanExpiredData(): void;
    sendVerificationEmail(to: string, subject: string, verificationCode: string): Promise<Array<string>>;
    verified(options: CreateUserDto): Promise<any>;
}
