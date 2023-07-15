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
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const auth_schema_1 = require("./auth.schema");
const mongoose_1 = require("mongoose");
const mongoose_2 = require("@nestjs/mongoose");
const jwt_1 = require("@nestjs/jwt");
const bcryptjs = require("bcryptjs");
const verification_code_service_1 = require("./verification-code.service");
let AuthService = exports.AuthService = class AuthService {
    constructor(jwtService, verificationCodeService, userModel) {
        this.jwtService = jwtService;
        this.verificationCodeService = verificationCodeService;
        this.userModel = userModel;
    }
    async register(createUserDto) {
        const { email, password, code } = createUserDto;
        const existingUser = await this.userModel.findOne({ email });
        if (existingUser) {
            return {
                success: false,
                data: {
                    message: "该邮箱已注册！"
                }
            };
        }
        if (code) {
            let resCode = this.verificationCodeService.getData(email);
            if (code !== resCode) {
                return {
                    success: false,
                    data: {
                        message: "请输入正确的验证码！"
                    }
                };
            }
        }
        else {
            return {
                success: false,
                data: {
                    message: "请输入正确的验证码！"
                }
            };
        }
        const saltRounds = 10;
        const hashedPassword = await bcryptjs.hashSync(password, saltRounds);
        const newUser = new this.userModel({ email, password: hashedPassword });
        await newUser.save();
        return {
            data: {
                message: "message: 注册成功"
            },
            success: true
        };
    }
    async login(loginDto) {
        const { email, password } = loginDto;
        const res = {
            code: 999,
            success: false,
            data: {
                message: ''
            }
        };
        console.log("---loginDto:", loginDto);
        const user = await this.userModel.findOne({ email });
        if (!user) {
            res.data.message = '用户不存在';
            return res;
        }
        const isPasswordMatch = await bcryptjs.compareSync(password, user.password);
        if (!isPasswordMatch) {
            res.data.message = '密码不正确';
            return res;
        }
        Object.assign(res, {
            code: 200,
            success: true,
            data: {}
        });
        return { ...res, access_token: await this.jwtService.signAsync({ email }) };
    }
};
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __param(2, (0, mongoose_2.InjectModel)(auth_schema_1.User.name)),
    __metadata("design:paramtypes", [jwt_1.JwtService,
        verification_code_service_1.VerificationCodeService,
        mongoose_1.Model])
], AuthService);
//# sourceMappingURL=auth.service.js.map