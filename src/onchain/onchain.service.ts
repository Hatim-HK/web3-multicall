import { Injectable } from '@nestjs/common';
import { ethers } from 'ethers';

@Injectable()
export class OnchainService {
  private provider = new ethers.providers.JsonRpcProvider(process.env.RPC_URL);
  private multicall = new ethers.Contract(
    '0x5BA1e12693Dc8F9c48aAD8770482f4739bEeD696',
    ['function aggregate(tuple(address target, bytes callData)[]) view returns (uint256, bytes[])'],
    this.provider,
  );
  private erc20Iface = new ethers.utils.Interface(['function balanceOf(address) view returns (uint256)']);

  async batchFetchBalances(wallet: string, tokens: string[]): Promise<Record<string, string>> {
    const calls = tokens.map(t => ({
      target: t,
      callData: this.erc20Iface.encodeFunctionData('balanceOf', [wallet]),
    }));
    const [, returnData]: [ethers.BigNumber, string[]] = await this.multicall.aggregate(calls);
    return tokens.reduce((out, t, i) => {
      out[t] = this.erc20Iface.decodeFunctionResult('balanceOf', returnData[i])[0].toString();
      return out;
    }, {} as Record<string, string>);
  }
}
