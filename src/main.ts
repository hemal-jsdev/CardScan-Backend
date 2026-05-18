import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { ExpressAdapter } from '@nestjs/platform-express';
import express from 'express';

const server = express();

export const createNestServer = async (expressInstance: any) => {
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
  SwaggerModule.setup('api/docs', app, document);

  await app.init();
};

// Bootstrap if running locally (not in serverless environment)
if (process.env.NODE_ENV !== 'production' && !process.env.VERCEL) {
  const port = process.env.PORT ?? 3000;
  server.listen(port, () => {
    console.log(`🚀 CardScan API running locally on: http://localhost:${port}/api/v1`);
    console.log(`📖 Swagger docs: http://localhost:${port}/api/docs`);
  });
}

// Initialize serverless server immediately
createNestServer(server);

// Export express server instance for Vercel Serverless Integration
export default server;
