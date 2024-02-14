import { BadGatewayException, Body, Controller, ExecutionContext, Get, Inject, Logger, OnModuleInit, Post, Query, UseFilters, UseInterceptors } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { USER_SERVICE_NAME, UserServiceClient } from './interfaces/user-service.interface';
import { GrpcToHttpInterceptor } from 'nestjs-grpc-exceptions';
import { firstValueFrom } from 'rxjs';
import { RpcExceptionFilter } from './exception/microservice-exception.filter';
import { PrismaGrpc2HttpInterceptor } from './interceptors/prisma-grpc2http.interceptor';
import { CreateUserDto, QueryDto } from './dto/create-user.dto';
import { Context } from './decorators/context.decroator';
import { I18n, I18nContext } from 'nestjs-i18n';
import { Metadata } from '@grpc/grpc-js';

@Controller()
@UseInterceptors(PrismaGrpc2HttpInterceptor)
// @UseInterceptors(GrpcToHttpInterceptor)
export class AppController implements OnModuleInit {
  constructor(@Inject(USER_SERVICE_NAME) private client: ClientGrpc) { }

  private readonly logger = new Logger('api-gateway');

  private userService: UserServiceClient;

  onModuleInit() {
    this.userService =
      this.client.getService<UserServiceClient>(USER_SERVICE_NAME);
  }


  @Get('user')
  async findUser(@Query() query: QueryDto, @I18n() i18n: I18nContext) {
    // this.logger.log(i18n.lang);
    const metadata = new Metadata();
    metadata.add('lang', i18n.lang);
    const user = await firstValueFrom(this.userService.findUser({ email: "alice@prisma.io" }));
    // this.logger.log(user)
    return user;
  }

  @Post('user')
  createUser() {
    // throw new BadGatewayException()
    return this.userService.create({ email: "alice@prisma.io2", id: 1, name: "alice" });
  }


}
