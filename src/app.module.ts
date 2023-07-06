import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { CatService } from './cat/cat.service';
import { CatSchema } from './cat/cat.schema';
import { CatModule } from './cat/cat.module';
import { AuthModule } from './auth/auth.module';
@Module({
  imports: [
    // 在docker上运行时，需要把主机的host改成宿主的ip，因为每个容器都有自己的ip，导致连接失败
    MongooseModule.forRoot('mongodb://172.16.180.89:27017/mongo-test'),
    CatModule,
    AuthModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
