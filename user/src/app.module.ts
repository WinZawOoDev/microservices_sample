import { Module, Scope } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { APP_FILTER } from '@nestjs/core';
import { PrismaErrorFilter } from './exceptions/prisma-error.filter';
import { PrismaService } from './prisma.service';
import { GrpcServerExceptionFilter } from 'nestjs-grpc-exceptions';
import { I18nModule, GrpcMetadataResolver } from 'nestjs-i18n';
import * as path from 'path';
import { I18nCustomResolver } from './i18n-custom.resolver';

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
