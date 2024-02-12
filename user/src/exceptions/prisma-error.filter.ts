import { Catch, RpcExceptionFilter, ArgumentsHost, Logger, HttpServer } from '@nestjs/common';
import { throwError } from 'rxjs';
import { RpcException } from '@nestjs/microservices';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { status } from '@grpc/grpc-js';

@Catch(PrismaClientKnownRequestError)
export class PrismaErrorFilter implements RpcExceptionFilter<RpcException> {

  private readonly logger = new Logger('prisma-exceptions-filter');

  catch(exception: RpcException | PrismaClientKnownRequestError, host: ArgumentsHost): any {

    this.logger.log(exception.name);

    if (exception instanceof PrismaClientKnownRequestError) {

      let prismaExcep = {} as PrismaErr;
      const error = exception.message.replace(/\n/g, '');

      switch (exception.code) {
        case "P2002":
          prismaExcep = { errorName: exception.name, statusCode: status.ALREADY_EXISTS, message: "Record already exists", error }
          break;
        case "P":
          prismaExcep = { errorName: exception.name, statusCode: status.NOT_FOUND, message: "Record not found", error }
          break;
        default:
          break;
      }

      return throwError(() => new RpcException(JSON.stringify(prismaExcep)));
    }
    return throwError(() => new RpcException(exception.getError()));
  }

}

type PrismaErr = {
  errorName: string;
  statusCode: number;
  message: string;
  error?: string;
}