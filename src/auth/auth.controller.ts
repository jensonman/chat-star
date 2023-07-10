import { Body, Controller, Post, Get, UseGuards, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginDto } from './dto/login-user.dto';
import { VerificationCodeService } from './verification-code.service';
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly verificationCodeService: VerificationCodeService
  ) {}

  @Post('verification-code')
  async verificationCode(@Body() createUserDto: CreateUserDto) {
    if(createUserDto.code) {
      return this.verificationCodeService.verified(createUserDto)
    }
    return this.verificationCodeService.generateVerificationCode(createUserDto.email);
  }
  @Post('register')
  async register(@Body() createUserDto: CreateUserDto) {
    return this.authService.register(createUserDto);
  }
  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }
  
}
