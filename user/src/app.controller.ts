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

  async findUser(request: UserByEmail): Promise<any> {
    const user = await this.appServices.user(request);
    console.log(user)
    return user;
  }

  create(request: User): User | Promise<User> | Observable<User> {
    return this.appServices.createUser(request);
  }

}
