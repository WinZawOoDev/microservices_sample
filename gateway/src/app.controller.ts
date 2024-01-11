import { Controller, Get, Inject, OnModuleInit, Post, UseInterceptors } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { USER_SERVICE_NAME, UserServiceClient } from './interfaces/user-service.interface';
import { GrpcToHttpInterceptor } from 'nestjs-grpc-exceptions';
import { firstValueFrom } from 'rxjs';

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
  async findUser() {
    const user = await firstValueFrom(this.userService.findUser({ email: "alice@prisma.io" }));
    return user;
  }

  @Post('user')
  createUser() {
    return this.userService.create({ email: "alice@prisma.io2", id: 1, name: "alice" });
  }


}
