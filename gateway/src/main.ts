import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { USER_PACKAGE_NAME } from './interfaces/user-service.interface';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({ transform: true }))
  const s = app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.GRPC,
    options: {
      url: `0.0.0.0:3001`,
      package: USER_PACKAGE_NAME,
      protoPath: join(__dirname, '__proto/user-service.proto')
    },
  }, { inheritAppConfig: true });

  await app.startAllMicroservices()
  await app.listen(3000, '0.0.0.0');
}
bootstrap();
