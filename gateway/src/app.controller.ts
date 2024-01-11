import { Controller, Get, Inject, OnModuleInit, Post, UseInterceptors } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { USER_SERVICE_NAME, UserServiceClient } from './interfaces/user-service.interface';
import { GrpcToHttpInterceptor } from 'nestjs-grpc-exceptions';

@Controller()
@UseInterceptors(GrpcToHttpInterceptor)
export class AppController implements OnModuleInit {
  constructor(@Inject(USER_SERVICE_NAME) private client: ClientGrpc) { }

  private userService: UserServiceClient;

  onModuleInit() {
    this.userService =
      this.client.getService<UserServiceClient>(USER_SERVICE_NAME);
  }

  @Get('user')
  findUser() {
    return this.userService.findUser({ email: "alice@prisma.io2" });
  }

  @Post('user')
  createUser() {
    return this.userService.create({ email: "alice@prisma.io2", id: 1, name: "alice" });
  }


}
