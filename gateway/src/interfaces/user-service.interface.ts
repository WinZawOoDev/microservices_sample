/* eslint-disable */
import { Metadata } from "@grpc/grpc-js";
import { GrpcMethod, GrpcStreamMethod } from "@nestjs/microservices";
import { Observable } from "rxjs";

export const protobufPackage = "user";

export interface UserByEmail {
  email: string;
}

export interface User {
  id: number;
  email: string;
  name: string;
}

export const USER_PACKAGE_NAME = "user";

export interface UserServiceClient {
  findUser(request: UserByEmail, metadata?: Metadata): Observable<User>;

  create(request: User, metadata?: Metadata): Observable<User>;
}

export interface UserServiceController {
  findUser(request: UserByEmail, metadata?: Metadata): Promise<User> | Observable<User> | User;

  create(request: User, metadata?: Metadata): Promise<User> | Observable<User> | User;
}

export function UserServiceControllerMethods() {
  return function (constructor: Function) {
    const grpcMethods: string[] = ["findUser", "create"];
    for (const method of grpcMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcMethod("UserService", method)(constructor.prototype[method], method, descriptor);
    }
    const grpcStreamMethods: string[] = [];
    for (const method of grpcStreamMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcStreamMethod("UserService", method)(constructor.prototype[method], method, descriptor);
    }
  };
}

export const USER_SERVICE_NAME = "UserService";
