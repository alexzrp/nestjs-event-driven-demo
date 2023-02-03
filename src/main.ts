import { Logger } from '@nestjs/common';
import { rolesMapBootstrap } from './container-role';
import { NestFactory } from '@nestjs/core';
import { AsyncApiDocumentBuilder, AsyncApiModule } from 'nestjs-asyncapi';
import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { CommonModule } from './common/common.module';

async function bootstrap() {
  const role = process.env.CONTAINER_ROLE;
  if (role) await rolesMapBootstrap[role]();

  const app = await NestFactory.create<NestExpressApplication>(CommonModule);

  const documentBuilderConfig = new DocumentBuilder()
    .setTitle('Demo')
    .setDescription('Demo OpenAPI')
    .setVersion('1.0')
    .build();
  const swaggerDocument = SwaggerModule.createDocument(
    app,
    documentBuilderConfig,
    {
      ignoreGlobalPrefix: false,
      deepScanRoutes: true,
    },
  );
  SwaggerModule.setup('docs/openapi', app, swaggerDocument);

  const asyncApiOptions = new AsyncApiDocumentBuilder()
    .setTitle('Demo')
    .setDescription('Demo server description here')
    .setVersion('1.0')
    .setDefaultContentType('application/json')
    .addSecurity('user-password', { type: 'userPassword' })
    .build();

  const asyncApiDocument = await AsyncApiModule.createDocument(
    app,
    asyncApiOptions,
  );
  await AsyncApiModule.setup('docs/asyncapi', app, asyncApiDocument);

  const logger = new Logger();
  logger.log(`Container role: ${role}`);

  return app.listen(3000);
}

bootstrap();
