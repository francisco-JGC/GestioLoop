import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('GestioLoop')
    .setDescription('The GestioLoop APIs description')
    .setVersion('1.0')
    .addTag('GestioLoop')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  app.use(cookieParser());

  app.enableCors({
    origin: (origin, callback) => {
      const allowedOrigins = [
        'http://localhost',
        'https://gestioloop.com',
        'https://www.gestioloop.com',
      ];

      if (!origin) {
        return callback(null, true);
      }

      if (origin.endsWith('.gestioloop.com') || origin.endsWith('.localhost')) {
        return callback(null, true);
      }

      if (
        allowedOrigins.some((allowedOrigin) => origin.startsWith(allowedOrigin))
      ) {
        return callback(null, true);
      }

      return callback(new Error('Not allowed by CORS'));
    },
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  await app.listen(8080);
}
bootstrap();
