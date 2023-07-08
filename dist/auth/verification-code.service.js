"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VerificationCodeService = void 0;
const common_1 = require("@nestjs/common");
const nodemailer_1 = require("nodemailer");
const redis_service_1 = require("./redis.service");
let VerificationCodeService = exports.VerificationCodeService = class VerificationCodeService {
    constructor(redisService) {
        this.redisService = redisService;
        this.transporter = (0, nodemailer_1.createTransport)({
            host: 'smtp.163.com',
            port: 465,
            secure: true,
            auth: {
                user: 'wecode2old@163.com',
                pass: 'FVFNAGUQODNXLBSR',
            },
        });
    }
    async generateVerificationCode(toEmail) {
        const min = 100000;
        const max = 999999;
        const verificationCode = String(Math.floor(Math.random() * (max - min + 1)) + min);
        const verificationData = {
            verificationCode,
            lastRegistrationRequest: Date.now()
        };
        try {
            await this.sendVerificationEmail(toEmail, "主题：验证码", verificationCode);
            await this.redisService.set(toEmail, JSON.stringify(verificationData));
        }
        catch (error) {
            return '验证码发送失败，请重新发送';
        }
        return '验证码已发送，请查收邮件。';
    }
    async sendVerificationEmail(to, subject, verificationCode) {
        this.transporter.verify(function (error, success) {
            if (error) {
                console.log(error);
            }
            else {
                console.log('email is ready');
            }
        });
        await this.transporter.sendMail({
            from: 'wecode2old@163.com',
            to,
            subject,
            html: `
        <body style="font-family: Arial, sans-serif;">

        <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
            <h2 style="text-align: center;">Email Verification</h2>
            <p>Dear ${to},</p>
            <p>Thank you for registering with our platform. To complete your registration, please use the following verification code:</p>
            <p style="text-align: center; font-size: 24px; font-weight: bold;">${verificationCode}</p>
            <p>If you didn't register an account with us, you can ignore this email.</p>
        </div>

        </body>`,
        });
    }
    async verified(options) {
        let message;
        await this.redisService.get(options.email).then((res) => {
            let data = JSON.parse(res);
            if (data.lastRegistrationRequest) {
                const timeDiff = Date.now() - data.lastRegistrationRequest;
                const registrationInterval = 60 * 1000;
                if (timeDiff < registrationInterval) {
                    throw new Error('Registration requests are too frequent. Please try again later.');
                }
            }
            if (data && data.verificationCode === options.code) {
                message = "验证通过";
            }
        }).catch((error) => {
            console.log(error);
            message = "验证不通过";
        });
        console.log(message);
        return message;
    }
};
exports.VerificationCodeService = VerificationCodeService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [redis_service_1.RedisService])
], VerificationCodeService);
//# sourceMappingURL=verification-code.service.js.map