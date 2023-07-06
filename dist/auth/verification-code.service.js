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
let VerificationCodeService = exports.VerificationCodeService = class VerificationCodeService {
    constructor() {
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
        const verificationCode = 'generate-your-verification-code-here';
        console.log("-----test-----", toEmail);
        await this.sendVerificationEmail(toEmail, "主题：验证码", "code:" + verificationCode);
        return '验证码已发送，请查收邮件。';
    }
    async sendVerificationEmail(to, subject, body) {
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
            text: body,
        });
    }
};
exports.VerificationCodeService = VerificationCodeService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], VerificationCodeService);
//# sourceMappingURL=verification-code.service.js.map