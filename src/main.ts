import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { sendMail } from "./email/sendMail";

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {cors:false});
  app.setGlobalPrefix('/api');
  await app.listen(4000);
}
bootstrap();
