import { Test, TestingModule } from '@nestjs/testing'
import { AppService } from "./app.service"
import { PrismaClient, User } from '@prisma/client';
import { DeepMockProxy, mockDeep } from 'jest-mock-extended'
import { PrismaService } from './prisma.service';

describe('App Service Unit Testing', () => {

    let appService: AppService;
    let mockPrisma: DeepMockProxy<PrismaClient>;

    const mockUser: User = { id: 1, email: 'test@email', name: "test" };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [AppService, PrismaService]
        })
            .overrideProvider(PrismaService)
            .useValue(mockDeep<PrismaClient>())
            .compile()

        mockPrisma = module.get(PrismaService);
        appService = module.get(AppService);

        const app = module.createNestApplication();
        await app.init();
    })

    describe('user', () => {
        it('should retrieve user from database', async () => {
            //@ts-ignore
            mockPrisma.user.findUnique.mockResolvedValue(mockUser)
            const user = await appService.user({ id: 1 });
            expect(mockPrisma.user.findUnique).toHaveBeenCalled();
            expect(user).toEqual(mockUser);
        })
    })

    describe('users', () => {
        it('should retrieve users from database', async () => {
            //@ts-ignore
            mockPrisma.user.findMany.mockResolvedValue([mockUser])
            const users = await appService.users({ skip: 1, take: 5 })
            expect(mockPrisma.user.findMany).toHaveBeenCalled();
            expect(users).toEqual([mockUser]);
        })
    })

    describe('createUser', () => {
        it('should create user to database and return created user', async () => {
            //@ts-ignore
            mockPrisma.user.create.mockResolvedValueOnce(mockUser)
            const createdUser = await appService.createUser(mockUser)
            expect(mockPrisma.user.create).toHaveBeenCalled();
            expect(createdUser).toEqual(mockUser);
        })
    })

    describe('updateUser', () => {
        it('should update user to database and return updated User', async () => {
            //@ts-ignore
            mockPrisma.user.update.mockResolvedValueOnce(mockUser)
            const updatedUser = await appService.updateUser({ where: { id: 1 }, data: mockUser });
            expect(mockPrisma.user.update).toHaveBeenCalled();
            expect(updatedUser).toEqual(mockUser);
        })
    })

    describe('deletedUser', () => {
        it('should delete user to database and return deleted User', async () => {
            //@ts-ignore
            mockPrisma.user.delete.mockResolvedValueOnce(mockUser)
            const deletedUser = await appService.deleteUser({ id: 1 });
            expect(mockPrisma.user.delete).toHaveBeenCalled();
            expect(deletedUser).toEqual(mockUser);
        })
    })
})