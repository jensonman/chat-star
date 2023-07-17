import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { OpenAiModule } from './openai/openai.module';
require('dotenv').config();

@Module({
  imports: [
    // 在docker上运行时，需要把主机的host改成宿主的ip，因为每个容器都有自己的ip，导致连接失败
    MongooseModule.forRoot(`mongodb://${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_DATABASE}`),
    AuthModule,
    OpenAiModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
