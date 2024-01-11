import { Catch, RpcExceptionFilter, ArgumentsHost, ExceptionFilter, HttpStatus } from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { BaseRpcExceptionFilter, RpcException } from '@nestjs/microservices';
import { Prisma } from '@prisma/client';
import { GrpcAbortedException, GrpcAlreadyExistsException, GrpcInvalidArgumentException } from 'nestjs-grpc-exceptions';
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