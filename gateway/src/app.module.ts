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
import { ClsModule, ClsServiceManager } from 'nestjs-cls';

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
    ClsModule.forRoot({
      global: true,
      middleware: {
        mount: true,
        setup: (cls, req) => {
          // console.log(req['headers']);
          cls.set('req_headers', req['headers'])
        }
      }
    })
    ,
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
                const cls = ClsServiceManager.getClsService();
                console.log(cls.get('req_headers'))
                return new InterceptingCall(nextCall(options), {
                  start: (metadata: Metadata, listener, next) => {

                    const headers = cls.get('req_headers');
                    const req_headers = JSON.stringify(headers)

                    metadata.add('lang', I18nContext.current().lang);
                    metadata.add('http-user-agent', req_headers);

                    // for (const [key, value] of Object.entries(headers)) {
                    //   console.log(`Key: ${key}, Value: ${value}`);
                    // }

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
