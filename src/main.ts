import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { Logger, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { DomainErrorFilter } from './common/filters/domain-error.filter';
import cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cookieParser());
  const logger = new Logger('Bootstrap');

  const config = new DocumentBuilder()
    .setTitle('Easy Order API')
    .setDescription('API documentation for the easy order system')
    .setVersion('1.0')
    .addCookieAuth('access_token')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  app.useGlobalFilters(new DomainErrorFilter());

  await app.listen(process.env.PORT ?? 3000);
  logger.log(`🚀 Application is running on: ${await app.getUrl()}`);
  logger.log(`📄 Swagger docs available at: ${await app.getUrl()}/api`);
}
bootstrap().catch(console.error);
