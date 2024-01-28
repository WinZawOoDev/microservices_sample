import { ExceptionFilter, Catch, ArgumentsHost, HttpException, Logger } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { Request, Response } from 'express';

@Catch(RpcException)
export class RpcExceptionFilter implements ExceptionFilter {

    private readonly logger = new Logger('rpc-exceptions');

    catch(exception: RpcException, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest<Request>();


        this.logger.log(exception.message);

        response
            .status(300)
            .json({
                statusCode: 300,
                timestamp: new Date().toISOString(),
                path: request.url,
            });
    }
}