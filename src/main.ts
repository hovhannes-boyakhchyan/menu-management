import { NestFactory, Reflector } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { Logger } from '@nestjs/common';
import { LocalizeInterceptor } from '@bringit/nestjs-http';
import { LOCALES, DEFAULT_LOCALE } from '@bringit/contracts';
import { AppModule } from './app.module';
import {
  AllExceptionsFilter,
  ResponseFormatInterceptor,
} from './infrastructure/http/interceptors';
import { HttpAccessLogInterceptor } from './infrastructure/logging';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['log', 'error', 'warn', 'debug', 'verbose'],
  });
  const configs: ConfigService = app.get(ConfigService);

  app.setGlobalPrefix('menu-management');

  app.useGlobalInterceptors(
    new ResponseFormatInterceptor(),
    new LocalizeInterceptor(app.get(Reflector), {
      locales: LOCALES,
      defaultLocale: DEFAULT_LOCALE,
    }),
    new HttpAccessLogInterceptor(),
  );
  app.useGlobalFilters(new AllExceptionsFilter());

  app.enableShutdownHooks();

  const logger = new Logger('MENU MANAGEMENT SERVICE');
  const port = configs.get<number>('PORT') ?? 3002;
  const NODE_ENV = configs.get<string>('NODE_ENV');

  await app.listen(port, () => {
    logger.log(`Service is running on ==>> http://...:${port}`);
    logger.log(`ENVIRONMENT ==>> ${NODE_ENV}`);
  });
}
void bootstrap();
