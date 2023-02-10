import { Logger } from '@nestjs/common';
import { rolesMapBootstrap } from './container-role';
import { NestFactory } from '@nestjs/core';
import { AsyncApiDocumentBuilder, AsyncApiModule } from 'nestjs-asyncapi';
import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app/app.module';
import * as YAML from 'yaml';
import * as fs from 'fs';

async function bootstrap() {
  const role = process.env.CONTAINER_ROLE;
  if (role) {
    await rolesMapBootstrap[role]();
    const logger = new Logger();
    logger.log(`Container role: ${role}`);
  } else {
    const app = await NestFactory.create<NestExpressApplication>(AppModule, {
      forceCloseConnections: true,
    });
    app.enableShutdownHooks();

    const documentBuilderConfig = new DocumentBuilder()
      .setTitle('Demo')
      .setDescription('Demo OpenAPI')
      .setVersion('1.0')
      .build();
    const swaggerDocument = SwaggerModule.createDocument(
      app,
      documentBuilderConfig,
      {
        deepScanRoutes: true,
      },
    );
    SwaggerModule.setup('docs/openapi', app, swaggerDocument);

    const asyncApiOptions = new AsyncApiDocumentBuilder()
      .setTitle('Demo')
      .setDescription('Demo server description here')
      .setVersion('1.0')
      .setDefaultContentType('application/json')
      .addServer('demo', {
        protocol: 'redis',
        url: 'localhost',
        description: 'Demo Broker Server',
      })
      .build();

    const asyncApiDocument = await AsyncApiModule.createDocument(
      app,
      asyncApiOptions,
      {
        deepScanRoutes: true,
      },
    );
    fs.writeFileSync('openapi.json', JSON.stringify(swaggerDocument, null, 2));
    fs.writeFileSync(
      'asyncapi.json',
      JSON.stringify(asyncApiDocument, null, 2),
    );

    const yamlDocOpenapi = new YAML.Document(swaggerDocument);
    const yamlDocAsyncapi = new YAML.Document(asyncApiDocument);
    fs.writeFileSync('openapi.yaml', yamlDocOpenapi.toString());
    fs.writeFileSync('asyncapi.yaml', yamlDocAsyncapi.toString());

    await AsyncApiModule.setup('docs/asyncapi', app, asyncApiDocument);

    await app.listen(3000, '0.0.0.0');
    console.log(`Application is running on: ${await app.getUrl()}`);
  }
}

bootstrap();
