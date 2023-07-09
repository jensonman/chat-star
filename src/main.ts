import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {

  const app = await NestFactory.create(AppModule);
  // app.enableCors({
  //   origin: true,
  //   methods: 'GET,PUT,POST',
  //   allowedHeaders: 'Content-Type,Authorization',
  //   exposedHeaders: 'Content-Range,X-Content-Range',
  //   credentials: true,
  //   maxAge: 3600,
  // })
  app.enableCors();
  await app.listen(3000);
}
bootstrap();
