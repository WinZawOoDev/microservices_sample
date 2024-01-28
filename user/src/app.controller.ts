import { RpcException } from '@nestjs/microservices';
import { AppService } from './app.service';
import { Observable } from 'rxjs';
import { User, UserByEmail, UserServiceController, UserServiceControllerMethods } from './user-service';
import { Logger, UseInterceptors } from '@nestjs/common';
import { GrpcAbortedException, GrpcInternalException, HttpToGrpcInterceptor } from 'nestjs-grpc-exceptions';


@UseInterceptors(HttpToGrpcInterceptor)
@UserServiceControllerMethods()
export class AppController implements UserServiceController {
  constructor(private readonly appServices: AppService) { }

  private readonly logger = new Logger("User-sevices");

  async findUser(request: UserByEmail): Promise<User> {
    const user = await this.appServices.user(request);
    this.logger.log(user);
    return user;
  }

  create(request: User): User | Promise<User> | Observable<User> {
    // throw new  GrpcAbortedException('teoio');
    return this.appServices.createUser(request);
  }

}
