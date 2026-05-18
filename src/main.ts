import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { ExpressAdapter } from '@nestjs/platform-express';
import express from 'express';

const server = express();
let isInitialized = false;

export const createNestServer = async (expressInstance: any) => {
  if (isInitialized) return;

  const app = await NestFactory.create(AppModule, new ExpressAdapter(expressInstance));

  // ── Global Validation Pipe ──────────────────────────────────────────────────
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,          // Strip unknown properties
      forbidNonWhitelisted: true, // Throw if unknown properties are sent
      transform: true,          // Auto-transform payloads to DTO class types
    }),
  );

  // ── CORS ───────────────────────────────────────────────────────────────────
  app.enableCors({
    origin: '*', // Restrict in production
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  });

  // ── API Prefix ─────────────────────────────────────────────────────────────
  app.setGlobalPrefix('api/v1');

  // ── Swagger API Docs ───────────────────────────────────────────────────────
  const config = new DocumentBuilder()
    .setTitle('CardScan API')
    .setDescription('CardScan Backend REST API — Production v1.0')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);

  const cdnBase = 'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/5.11.0';
  SwaggerModule.setup('api/docs', app, document, {
    customCssUrl: `${cdnBase}/swagger-ui.min.css`,
    customJs: [
      `${cdnBase}/swagger-ui-bundle.min.js`,
      `${cdnBase}/swagger-ui-standalone-preset.min.js`,
    ],
  });

  await app.init();
  isInitialized = true;
};

// Bootstrap if running locally (not in serverless environment)
if (process.env.NODE_ENV !== 'production' && !process.env.VERCEL) {
  const port = process.env.PORT ?? 3000;
  createNestServer(server).then(() => {
    server.listen(port, () => {
      console.log(`🚀 CardScan API running locally on: http://localhost:${port}/api/v1`);
      console.log(`📖 Swagger docs: http://localhost:${port}/api/docs`);
    });
  });
}

// Export express server instance
export default server;
