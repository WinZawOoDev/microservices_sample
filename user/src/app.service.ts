import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { User, Prisma } from '@prisma/client';
import { GrpcInternalException } from 'nestjs-grpc-exceptions';

@Injectable()
export class AppService {
  constructor(private prisma: PrismaService) { }

  async user(
    userWhereUniqueInput: Prisma.UserWhereUniqueInput,
  ): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: userWhereUniqueInput,
    });
  }

  async users(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.UserWhereUniqueInput;
    where?: Prisma.UserWhereInput;
    orderBy?: Prisma.UserOrderByWithRelationInput;
  }): Promise<User[]> {
    try {
      const { skip, take, cursor, where, orderBy } = params;
      return this.prisma.user.findMany({
        skip,
        take,
        cursor,
        where,
        orderBy,
      });
    } catch (error) {
      throw new GrpcInternalException(error);
    }

  }

  async createUser(data: Prisma.UserCreateInput): Promise<User> {
    // try {
    const user = await this.prisma.user.create({
      data,
    });
    return user;
    // } catch (error) {
    //   throw new GrpcInternalException(error);
    // }

  }

  async updateUser(params: {
    where: Prisma.UserWhereUniqueInput;
    data: Prisma.UserUpdateInput;
  }): Promise<User> {
    try {
      const { where, data } = params;
      return this.prisma.user.update({
        data,
        where,
      });
    } catch (error) {
      throw new GrpcInternalException(error);
    }

  }

  async deleteUser(where: Prisma.UserWhereUniqueInput): Promise<User> {
    try {
      return this.prisma.user.delete({
        where,
      });
    } catch (error) {
      throw new GrpcInternalException(error);
    }

  }
}