import { BadGatewayException, Body, Controller, Get, Inject, Logger, OnModuleInit, Post, Query, UseFilters, UseInterceptors } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { USER_SERVICE_NAME, UserServiceClient } from './interfaces/user-service.interface';
import { GrpcToHttpInterceptor } from 'nestjs-grpc-exceptions';
import { firstValueFrom } from 'rxjs';
import { RpcExceptionFilter } from './exception/microservice-exception.filter';
import { PrismaGrpc2HttpInterceptor } from './interceptors/prisma-grpc2http.interceptor';
import { CreateUserDto, QueryDto } from './dto/create-user.dto';

@Controller()
@UseInterceptors(PrismaGrpc2HttpInterceptor)
@UseInterceptors(GrpcToHttpInterceptor)
export class AppController implements OnModuleInit {
  constructor(@Inject(USER_SERVICE_NAME) private client: ClientGrpc) { }

  private readonly logger = new Logger('api-gateway');

  private userService: UserServiceClient;

  onModuleInit() {
    this.userService =
      this.client.getService<UserServiceClient>(USER_SERVICE_NAME);
  }

  @Get('user')
  async findUser(@Query() query: QueryDto) {
    this.logger.log(typeof query.is_user)
    return query;
    const user = await firstValueFrom(this.userService.findUser({ email: "alice@prisma.i" }));
    this.logger.log(user)
    return user;
  }

  @Post('user')
  createUser(@Body() createUserDto: CreateUserDto) {
    // throw new BadGatewayException()
    return this.userService.create({ email: "alice@prisma.io2", id: 1, name: "alice" });
  }


}
