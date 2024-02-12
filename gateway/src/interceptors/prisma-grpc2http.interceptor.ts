import { status as GrpcStatus } from '@grpc/grpc-js';
import { Injectable, NestInterceptor, ExecutionContext, CallHandler, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable()
export class PrismaGrpc2HttpInterceptor implements NestInterceptor {

    private readonly logger = new Logger('prisma-grpc2http-exception');

    private readonly grpc2http_code: Record<string, number> = {
        [GrpcStatus.ALREADY_EXISTS]: HttpStatus.CONFLICT,
        [GrpcStatus.NOT_FOUND]: HttpStatus.NO_CONTENT,
    };

    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        return next.handle().pipe(
            catchError(err => {
                // this.logger.log(err)
                if (!(typeof err === "object" && "details" in err && this.is_json_str(err.details)))
                    return throwError(() => err);

                const { errorName, ...res } = JSON.parse(err.details) as PrismaErr;

                if (!errorName || !errorName.toLocaleLowerCase().includes('prisma'))
                    return throwError(() => err);


                return throwError(() => new HttpException({ ...res, statusCode: this.grpc2http_code[res.statusCode] }, this.grpc2http_code[res.statusCode]));

            }),
        );
    };

    private is_json_str(json_str: string): boolean {
        try {
            JSON.parse(json_str);
            return true;
        } catch (error) {
            return false;
        }
    }
};

type PrismaErr = {
    errorName: string;
    statusCode: number;
    message: string;
    error?: string;
}