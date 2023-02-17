import { Logger } from '@nestjs/common';
import { rolesMapBootstrap } from './container-role';
import { NestFactory } from '@nestjs/core';
import { AsyncApiDocumentBuilder, AsyncApiModule } from 'nestjs-asyncapi';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app/app.module';
import * as YAML from 'yaml';
import * as fs from 'fs';
import { Logger as PinoLogger } from 'nestjs-pino';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';

declare const module: any;

async function bootstrap() {
  const logger = new Logger();
  const role = process.env.CONTAINER_ROLE;
  if (role) {
    await rolesMapBootstrap[role]();
    logger.log(`Container role: ${role}`);
  } else {
    const app = await NestFactory.create<NestFastifyApplication>(
      AppModule,
      new FastifyAdapter(),
      {
        forceCloseConnections: true,
        bufferLogs: true,
      },
    );
    app.enableShutdownHooks();
    app.setGlobalPrefix('api');
    app.enableCors();
    app.useLogger(app.get(PinoLogger));

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
    logger.log(`Application is running on: ${await app.getUrl()}`);

    if (module.hot) {
      module.hot.accept();
      module.hot.dispose(() => app.close());
    }
  }
}

bootstrap();
