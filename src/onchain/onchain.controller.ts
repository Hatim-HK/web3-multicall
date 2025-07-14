import { Controller, Get, Query } from '@nestjs/common';
import { OnchainService } from './onchain.service';

@Controller('onchain')
export class OnchainController {
  constructor(private readonly onchain: OnchainService) {}

  @Get('balances')
  async getBalances(
    @Query('wallet') wallet: string,
    @Query('tokens') tokensCsv: string,
  ) {
    const tokens = tokensCsv.split(',');
    return this.onchain.batchFetchBalances(wallet, tokens);
  }
}