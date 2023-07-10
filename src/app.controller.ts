import { AppService } from './app.service';
import { AuthGuard } from './auth/auth.guard';
import {  Controller, Post, UseGuards, Request } from '@nestjs/common';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @UseGuards(AuthGuard)
  @Post('index')
  getProfile(@Request() req) {
    console.log(req)
    return {authentication:true};
  }
}
