import { Module, Scope } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { APP_FILTER } from '@nestjs/core';
import { PrismaErrorFilter } from './exceptions/prisma-error.filter';
import { PrismaService } from './prisma.service';
import { GrpcServerExceptionFilter } from 'nestjs-grpc-exceptions';

@Module({
  imports: [],
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
