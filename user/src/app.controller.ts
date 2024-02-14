import { RpcException } from '@nestjs/microservices';
import { AppService } from './app.service';
import { Observable } from 'rxjs';
import { User, UserByEmail, UserServiceController, UserServiceControllerMethods } from './user-service';
import { Logger, UseInterceptors } from '@nestjs/common';
import { GrpcAbortedException, GrpcInternalException, HttpToGrpcInterceptor } from 'nestjs-grpc-exceptions';
import { I18nContext, I18nService } from 'nestjs-i18n';
import { Metadata } from '@grpc/grpc-js';


@UseInterceptors(HttpToGrpcInterceptor)
@UserServiceControllerMethods()
export class AppController implements UserServiceController {
  constructor(
    private readonly appServices: AppService,
    private readonly i18nService: I18nService,
  ) { }

  private readonly logger = new Logger("User-sevices");

  async findUser(request: UserByEmail, metadata: Metadata): Promise<User> {
    this.logger.log(I18nContext.current().lang);
    const user = await this.appServices.user(request);
    // this.logger.log(user);
    return user;
  }

  create(request: User): User | Promise<User> | Observable<User> {
    // throw new  GrpcAbortedException('teoio');
    return this.appServices.createUser(request);
  }

}
