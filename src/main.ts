import path from 'path';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import passport from 'passport';
import session from 'express-session';
import SQLiteStoreFactory from 'connect-sqlite3';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const configService = app.get<ConfigService>(ConfigService);

  app.setGlobalPrefix('api');
  app.set('trust proxy', 1);
  app.use(
    session({
      secret: configService.get('secret'),
      name: 'session',
      resave: false,
      saveUninitialized: false,
      unset: 'destroy',
      cookie: {
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
        secure: process.env.NODE_ENV === 'production',
      },
      store: new (SQLiteStoreFactory(session))({
        db: 'sessions.sqlite3',
        dir: path.join(__dirname, '..'),
        concurrentDB: true,
      }),
    }),
  );
  app.use(passport.initialize());
  app.use(passport.session());

  const options = new DocumentBuilder()
    .setTitle('Meetups API')
    .setVersion('1.5.0')
    .addSecurity('cookie-session', {
      type: 'apiKey',
      in: 'cookie',
      name: 'connected',
    })
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api', app, document);

  await app.listen(
    configService.get<number>('port'),
    configService.get('host'),
  );
}
bootstrap();
