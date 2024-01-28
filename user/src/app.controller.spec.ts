import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TestBed } from '@automock/jest'
import { User } from '@prisma/client';

describe('AppController', () => {
    let appController: AppController;
    let appService: jest.Mocked<AppService>;
    // let appService: AppService;

    const mockUser: User = { id: 1, email: 'test@mail.com', name: 'test' };

    beforeEach(async () => {
        // const moduleRef: TestingModule = await Test.createTestingModule({
        //     imports: [],
        //     controllers: [AppController],
        //     providers: [AppService],
        // }).compile();

        // appController = moduleRef.get<AppController>(AppController);
        // appService = moduleRef.get<AppService>(AppService);
        const { unit, unitRef } = TestBed.create(AppController)
            .mock(AppService)
            .using({ user: jest.fn().mockRejectedValue(mockUser) })
            .compile();
        appController = unit;
        appService = unitRef.get(AppService); ``

    });

    it('should be defined', () => {
        expect(appController).toBeDefined();
    })

    // describe('findUser', () => {
    //     it('should return user object', async () => {

    //         expect(appService.user).toHaveBeenCalled();
    //         expect(await appController.findUser({ email: "test@mail.com" })).toBe(mockUser);
    //     });
    // });
});
