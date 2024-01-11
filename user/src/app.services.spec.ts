import { Test, TestingModule } from '@nestjs/testing'
import { TestBed } from '@automock/jest'
import { AppService } from "./app.service"
import { PrismaClient, User } from '@prisma/client';
import { DeepMockProxy, mockDeep, mockReset } from 'jest-mock-extended'
import prisma from '../prisma/client'
import { PrismaService } from './prisma.service';

describe('App Service Unit Testing', () => {

    let appService: AppService;
    let mockPrisma: DeepMockProxy<PrismaClient>;
    // const prismaMock = prisma as unknown as DeepMockProxy<PrismaClient>


    // jest.mock('../prisma/client.ts', () => ({
    //     __esModule: true,
    //     default: mockDeep<PrismaClient>(),
    // }))

    const mockUser: User = { id: 1, email: 'test@email', name: "test" };


    beforeAll(async () => {
        const deep = mockDeep<PrismaClient>();
        // const { unit } = TestBed.create(AppService).mock(PrismaService).using({ ...deep }).compile();
        // appService = unit;
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

    it('should retrieves users from database', async () => {
        //@ts-ignore
        mockPrisma.user.findMany.mockResolvedValue([mockUser]);

        const users = await appService.findAll();
        expect(mockPrisma.user.findMany).toHaveBeenCalled();
        expect(users).toEqual([mockUser]);

    })

})