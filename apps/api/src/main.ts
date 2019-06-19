/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 **/

import { NestFactory } from '@nestjs/core';

import { AppModule } from './app/app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const globalPrefix = 'api';
  app.setGlobalPrefix(globalPrefix);

  // Add Swagger
  const options = new DocumentBuilder()
    .setTitle('Dogs API')
    .setDescription('The Dogs API description')
    .setVersion('1.0')
    .addTag('dogs')
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api/help', app, document);

  const port = process.env.port || 3333;
  await app.listen(port, () => {
    console.log('Listening at http://localhost:' + port + '/' + globalPrefix);
  });
}

bootstrap();
