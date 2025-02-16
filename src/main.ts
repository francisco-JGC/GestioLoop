import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { TenantMiddleware } from './middlewares/tenant.middleware';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });

  const config = new DocumentBuilder()
    .setTitle('GestioLoop')
    .setDescription('The GestioLoop APIs description')
    .setVersion('1.0')
    .addTag('GestioLoop')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  app.enableCors();
  app.useGlobalPipes(
    new ValidationPipe({
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  app.enableCors({
    origin: (origin, callback) => {
      const allowedOrigins = [
        'http://localhost', // to test with localhost
        'https://gestioloop.com', // to test with the main domain
        'https://www.gestioloop.com', // to test with the main domain
      ];

      // to allow requests with no origin (like Postman or CURL requests)
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
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE', // Allow only these methods
    credentials: true, // Allow cookies and other credentials to be sent
  });

  // app.use(new TenantMiddleware().use);

  await app.listen(8080);
}
bootstrap();
