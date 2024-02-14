import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { USER_PACKAGE_NAME, USER_SERVICE_NAME } from './interfaces/user-service.interface';
import { AcceptLanguageResolver, I18nContext, I18nModule } from 'nestjs-i18n';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { GrpcInterceptor } from './interceptors/grpc.interceptor';
import { InterceptingCall, Metadata } from '@grpc/grpc-js';

@Module({
  imports: [
    I18nModule.forRoot({
      fallbackLanguage: 'en',
      loaderOptions: {
        path: join(__dirname, '/i18n/'),
        watch: true,
      },
      resolvers: [
        AcceptLanguageResolver,
      ]
    }),
    ClientsModule.register([
      {
        name: USER_SERVICE_NAME,
        transport: Transport.GRPC,
        options: {
          url: `user:3001`,
          package: USER_PACKAGE_NAME,
          protoPath: join(__dirname, '__proto/user-service.proto'),
          channelOptions: {
            interceptors: [
              (options, nextCall) => {
                return new InterceptingCall(nextCall(options), {
                  start: (metadata: Metadata, listener, next) => {
                    metadata.add('lang', I18nContext.current().lang),
                      next(metadata, listener)
                  }
                });
              },
            ]
          }
        },
      },
    ]),
  ],
  controllers: [AppController],
  providers: [AppService, { provide: APP_INTERCEPTOR, useClass: GrpcInterceptor }],
})
export class AppModule { }
