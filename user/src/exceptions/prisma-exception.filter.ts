import { Catch, RpcExceptionFilter, ArgumentsHost } from '@nestjs/common';
import { throwError } from 'rxjs';
import { RpcException } from '@nestjs/microservices';
import { Prisma } from '@prisma/client';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

@Catch(PrismaClientKnownRequestError, Prisma?.NotFoundError)
export class PrismaExceptionFilter implements RpcExceptionFilter<RpcException> {
  catch(exception: RpcException | PrismaClientKnownRequestError, host: ArgumentsHost): any {

    if (exception instanceof PrismaClientKnownRequestError) {

      return throwError(() => exception.message)
    }
    return;
  }
}