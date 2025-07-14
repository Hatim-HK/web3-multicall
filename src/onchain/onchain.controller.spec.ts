import { Test, TestingModule } from '@nestjs/testing';
import { OnchainController } from './onchain.controller';
import { OnchainService } from './onchain.service';

describe('OnchainController', () => {
  let controller: OnchainController;
  let service: OnchainService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OnchainController],
      providers: [
        {
          provide: OnchainService,
          useValue: { batchFetchBalances: jest.fn().mockResolvedValue({}) },
        },
      ],
    }).compile();

    controller = module.get<OnchainController>(OnchainController);
    service = module.get<OnchainService>(OnchainService);
  });

  it('should call service with correct params', async () => {
    await controller.getBalances(
      '0x1',
      '0x2,0x3',
    );
    expect(service.batchFetchBalances).toHaveBeenCalledWith(
      '0x1',
      ['0x2', '0x3'],
    );
  });
});