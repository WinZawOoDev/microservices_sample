import { RpcException } from '@nestjs/microservices';
import { AppService } from './app.service';
import { Observable } from 'rxjs';
import { User, UserByEmail, UserServiceController, UserServiceControllerMethods } from './user-service';
import { UseInterceptors } from '@nestjs/common';
import { HttpToGrpcInterceptor } from 'nestjs-grpc-exceptions';


@UseInterceptors(HttpToGrpcInterceptor)
@UserServiceControllerMethods()
export class AppController implements UserServiceController {
  constructor(private readonly appServices: AppService) { }

  findUser(request: UserByEmail): User | Observable<User> | Promise<User> {
    console.log(request);
    return this.appServices.user(request);
  }

  create(request: User): User | Promise<User> | Observable<User> {
    return this.appServices.createUser(request);
  }

}
