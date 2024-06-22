import { ExecutionContext, Module, Scope } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { APP_FILTER } from '@nestjs/core';
import { PrismaErrorFilter } from './exceptions/prisma-error.filter';
import { PrismaService } from './prisma.service';
import { GrpcServerExceptionFilter } from 'nestjs-grpc-exceptions';
import { I18nModule, GrpcMetadataResolver } from 'nestjs-i18n';
import * as path from 'path';
import { I18nCustomResolver } from './i18n-custom.resolver';
import ProducerService from './kafka/producer/producer.service';
import { KafkaProducerModule } from './kafka/producer/producer.module';
import { ClsModule, ClsServiceManager } from 'nestjs-cls';

@Module({
  imports: [
    I18nModule.forRoot({
      fallbackLanguage: 'en',
      loaderOptions: {
        path: path.join(__dirname, '/i18n/'),
        watch: true,
      },
      resolvers: [
        GrpcMetadataResolver
      ],
    }),
    KafkaProducerModule.register({ clientId: "my-app", brokers: ['kafka:9092'] }),
    ClsModule.forRoot({
      global: true,
      interceptor: ({
        mount: true,
        setup(cls, context: ExecutionContext) {
          const args = context.switchToRpc();
          const ctx = args.getContext();
          const internalRepr = ctx['internalRepr'] as Map<string, string | boolean | number>
          const http_user_agent = internalRepr.get('http-user-agent');
          cls.set('http_user_agent', JSON.parse(http_user_agent[0]));
        },
      })
    })
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_FILTER,
      useClass: PrismaErrorFilter,
    },
    {
      provide: APP_FILTER,
      useClass: GrpcServerExceptionFilter,
    },
    PrismaService
  ],
})
export class AppModule { }
