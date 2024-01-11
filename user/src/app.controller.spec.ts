import { Test } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { Hero } from './hero/hero';
import { ModuleMocker, MockFunctionMetadata } from 'jest-mock';

const moduleMocker = new ModuleMocker(global);

describe('App Controllers', () => {
  let appController: AppController;
  const result: Hero = { id: 1, name: 'Johin' };

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [AppController],
    })
      .useMocker((token) => {
        if (token === AppService) {
          return { user: jest.fn().mockResolvedValue(result) };
        }

        if (typeof token === 'function') {
          const mockMetadata = moduleMocker.getMetadata(
            token,
          ) as MockFunctionMetadata<any, any>;
          const Mock = moduleMocker.generateFromMetadata(mockMetadata);
          return new Mock();
        }
      })
      .compile();

    appController = moduleRef.get<AppController>(AppController);
  });

  describe('FindOne', () => {
    it('should return hero object', async () => {
      expect(appController.findUser).toBeDefined()
      expect(await appController.findUser({ email: "tets" })).toBe(result);
    });
  });
});
