import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { APP_PORT, APP_VERSION } from './env';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { LoggingInterceptor } from './logger/logging.interceptor';

async function bootstrap() {
    const app = await NestFactory.create<NestExpressApplication>(AppModule);

    app.enableShutdownHooks();
    app.disable('x-powered-by');
    app.enableCors();
    app.useGlobalInterceptors(new LoggingInterceptor());

    const config = new DocumentBuilder().setTitle('Abracadabra').setDescription('Abracadabra Defillama description').setVersion(APP_VERSION).build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('doc', app, document);

    await app.listen(APP_PORT);
}
bootstrap();
