import { Test, TestingModule } from '@nestjs/testing';
import { OnchainService } from './onchain.service';
import { ethers } from 'ethers';
import { BadRequestException } from '@nestjs/common';

describe('OnchainService', () => {
  let service: OnchainService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [OnchainService],
    }).compile();

    service = module.get<OnchainService>(OnchainService);

    // Mock the entire multicall contract
    // Create properly encoded uint256 data for balanceOf return (representing balance of 10)
    const encodedBalance = ethers.utils.defaultAbiCoder.encode(['uint256'], [10]);
    
    const mockMulticall = {
      aggregate: jest.fn().mockResolvedValue([
        ethers.BigNumber.from(0),
        [encodedBalance],
      ]),
    };

    // Replace the multicall instance
    service['multicall'] = mockMulticall as any;
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('service should be defined', () => {
    expect(service).toBeDefined();
  });

  it('batchFetchBalances returns decoded balances', async () => {
    const wallet = '0x0000000000000000000000000000000000000001';
    const token = '0x0000000000000000000000000000000000000002';

    const result = await service.batchFetchBalances(wallet, [token]);
    expect(result).toEqual({
      [ethers.utils.getAddress(token)]: '10',
    });
  });

  it('batchFetchBalances throws on invalid token address', async () => {
    const wallet = '0x0000000000000000000000000000000000000001';
    await expect(
      service.batchFetchBalances(wallet, ['not-an-address']),
    ).rejects.toThrow(BadRequestException);
  });
});