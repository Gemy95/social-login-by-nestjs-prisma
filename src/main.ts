import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { NestExpressApplication } from '@nestjs/platform-express';
import { json, urlencoded } from 'express';
import * as session from 'express-session';
import * as hbs from 'hbs';
import * as path from 'path';
import { HttpExceptionFilter } from './interceptors/error-handlling.interceptor';
import { TransformInterceptor } from './interceptors/response-handlling.interceptor';
import 'dotenv/config';


async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule,{cors:true, logger: ['error', 'warn','log']});
    app.use(json({ limit: '50mb' }));
    app.use(urlencoded({ limit: '50mb', extended: true }));
    app.enableCors();

    app.use(
      session({
        secret: 'my-secret',
        resave: false,
        saveUninitialized: false,
      }),
    );

  const config = new DocumentBuilder()
    .setTitle('Social Login Docs')
    .setDescription('')
    .setVersion('1.0')
    .addTag('')
    .addBearerAuth(
      { type: 'http', scheme: 'bearer', bearerFormat: 'JWT', in:'header' } )
    .build()
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  app.setBaseViewsDir(path.join(__dirname, '..', '/src/mail'));
  app.setViewEngine('hbs');
  hbs.registerPartials(path.join(__dirname, '..', '/src/mail/templates'));

  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalInterceptors(new TransformInterceptor());

  await app.listen( process.env.PORT || 3000);
}
bootstrap();
