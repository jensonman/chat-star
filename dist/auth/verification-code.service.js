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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VerificationCodeService = void 0;
const common_1 = require("@nestjs/common");
const nodemailer_1 = require("nodemailer");
const auth_schema_1 = require("./auth.schema");
const mongoose_1 = require("mongoose");
const mongoose_2 = require("@nestjs/mongoose");
const cache_service_1 = require("./cache.service");
const schedule_1 = require("@nestjs/schedule");
let VerificationCodeService = exports.VerificationCodeService = class VerificationCodeService {
    constructor(cacheService, userModel) {
        this.cacheService = cacheService;
        this.userModel = userModel;
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
        const codeExpireTime = 60;
        const existingUser = await this.userModel.find({ "email": toEmail });
        if (existingUser.length !== 0) {
            return {
                success: false,
                data: {
                    message: "该邮箱已注册！"
                }
            };
        }
        try {
            this.saveData(toEmail, verificationCode, codeExpireTime);
            let getData = this.getData(toEmail);
            if (getData) {
                await this.sendVerificationEmail(toEmail, "主题：验证码", verificationCode);
            }
        }
        catch (error) {
            return {
                success: false,
                data: {
                    message: "验证码发送失败，请重新发送"
                }
            };
        }
        return {
            success: true,
            data: {
                message: "验证码已发送到该邮箱，请查收"
            }
        };
    }
    saveData(key, value, expiration) {
        this.cacheService.set(key, value, expiration);
    }
    getData(key) {
        return this.cacheService.get(key);
    }
    cleanExpiredData() {
        this.cacheService.cleanExpiredData();
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
        let mailRes = await this.transporter.sendMail({
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
        return mailRes.accepted;
    }
    async verified(options) {
        let message;
        let res = this.getData(options.email);
        if (res === options.code) {
            message = "验证通过";
        }
        else {
            message = "验证不通过";
        }
        console.log(message);
        return message;
    }
};
__decorate([
    (0, schedule_1.Cron)('0 * * * * *'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], VerificationCodeService.prototype, "cleanExpiredData", null);
exports.VerificationCodeService = VerificationCodeService = __decorate([
    (0, common_1.Injectable)(),
    __param(1, (0, mongoose_2.InjectModel)(auth_schema_1.User.name)),
    __metadata("design:paramtypes", [cache_service_1.CacheService,
        mongoose_1.Model])
], VerificationCodeService);
//# sourceMappingURL=verification-code.service.js.map