"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthModule = void 0;
const common_1 = require("@nestjs/common");
const auth_controller_1 = require("./auth.controller");
const auth_service_1 = require("./auth.service");
const mail_service_1 = require("./mail.service");
const verification_code_service_1 = require("./verification-code.service");
const redis_service_1 = require("./redis.service");
const mongoose_1 = require("@nestjs/mongoose");
const auth_schema_1 = require("./auth.schema");
let AuthModule = exports.AuthModule = class AuthModule {
};
exports.AuthModule = AuthModule = __decorate([
    (0, common_1.Module)({
        imports: [mongoose_1.MongooseModule.forFeature([{ name: auth_schema_1.User.name, schema: auth_schema_1.UserSchema }])],
        controllers: [auth_controller_1.AuthController],
        providers: [redis_service_1.RedisService, auth_service_1.AuthService, mail_service_1.MailService, verification_code_service_1.VerificationCodeService]
    })
], AuthModule);
//# sourceMappingURL=auth.module.js.map