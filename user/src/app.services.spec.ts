import { Test, TestingModule } from '@nestjs/testing'
import { AppService } from "./app.service"
import { PrismaClient, User } from '@prisma/client';
import { DeepMockProxy, mockDeep } from 'jest-mock-extended'
import { PrismaService } from './prisma.service';

describe('App Service Unit Testing', () => {

    let appService: AppService;
    let prismaService: DeepMockProxy<PrismaClient>;

    const mockUser: User = { id: 1, email: 'test@email', name: "test" };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [AppService, PrismaService]
        })
            .overrideProvider(PrismaService)
            .useValue(mockDeep<PrismaClient>())
            .compile()

        prismaService = module.get(PrismaService);
        appService = module.get(AppService);

        const app = module.createNestApplication();
        await app.init();
    })

    describe('user', () => {
        it('should retrieve user record from database', async () => {
            //@ts-ignore
            prismaService.user.findUnique.mockResolvedValue(mockUser)
            const user = await appService.user({ id: 1 });
            expect(prismaService.user.findUnique).toHaveBeenCalled();
            expect(user).toEqual(mockUser);
        })
    })

    describe('users', () => {
        it('should retrieve user records from database', async () => {
            //@ts-ignore
            prismaService.user.findMany.mockResolvedValue([mockUser])
            const users = await appService.users({ skip: 1, take: 5 })
            expect(prismaService.user.findMany).toHaveBeenCalled();
            expect(users).toEqual([mockUser]);
        })
    })

    describe('createUser', () => {
        it('should create user record to database and return created user record', async () => {
            //@ts-ignore
            prismaService.user.create.mockResolvedValueOnce(mockUser)
            const createdUser = await appService.createUser(mockUser)
            expect(prismaService.user.create).toHaveBeenCalled();
            expect(createdUser).toEqual(mockUser);
        })
    })

    describe('updateUser', () => {
        it('should update user record to database and return updated user record', async () => {
            //@ts-ignore
            prismaService.user.update.mockResolvedValueOnce(mockUser)
            const updatedUser = await appService.updateUser({ where: { id: 1 }, data: mockUser });
            expect(prismaService.user.update).toHaveBeenCalled();
            expect(updatedUser).toEqual(mockUser);
        })
    })

    describe('deletedUser', () => {
        it('should delete user record to database and return deleted user record', async () => {
            //@ts-ignore
            prismaService.user.delete.mockResolvedValueOnce(mockUser)
            const deletedUser = await appService.deleteUser({ id: 1 });
            expect(prismaService.user.delete).toHaveBeenCalled();
            expect(deletedUser).toEqual(mockUser);
        })
    })
})