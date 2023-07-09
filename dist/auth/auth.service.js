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
const bcryptjs = require("bcryptjs");
let AuthService = exports.AuthService = class AuthService {
    constructor(userModel) {
        this.userModel = userModel;
    }
    async register(createUserDto) {
        const { email, password } = createUserDto;
        const existingUser = await this.userModel.findOne({ email });
        if (existingUser) {
            throw new Error('该邮箱已被注册');
        }
        const saltRounds = 10;
        const hashedPassword = await bcryptjs.hashSync(password, saltRounds);
        const newUser = new this.userModel({ email, password: hashedPassword });
        await newUser.save();
        return newUser;
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
            data: {
                user
            }
        });
        return res;
    }
};
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_2.InjectModel)(auth_schema_1.User.name)),
    __metadata("design:paramtypes", [mongoose_1.Model])
], AuthService);
//# sourceMappingURL=auth.service.js.map