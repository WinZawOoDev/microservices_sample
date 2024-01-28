import { Module, Scope } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { APP_FILTER } from '@nestjs/core';
import { PrismaExceptionFilter } from './exceptions/prisma-exception.filter';
import { PrismaService } from './prisma.service';
import { GrpcServerExceptionFilter } from 'nestjs-grpc-exceptions';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_FILTER,
      useClass: PrismaExceptionFilter,
    },
    {
      provide: APP_FILTER,
      useClass: GrpcServerExceptionFilter,
    },
    PrismaService
  ],
})
export class AppModule { }
