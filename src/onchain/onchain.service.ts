import { Injectable, BadRequestException } from '@nestjs/common';
import { ethers } from 'ethers';

@Injectable()
export class OnchainService {
  private provider = new ethers.providers.JsonRpcProvider(process.env.RPC_URL);
  private multicall = new ethers.Contract(
    '0x5BA1e12693Dc8F9c48aAD8770482f4739bEeD696',
    ['function aggregate(tuple(address target, bytes callData)[]) view returns (uint256, bytes[])'],
    this.provider,
  );
  private erc20Iface = new ethers.utils.Interface([
    'function balanceOf(address) view returns (uint256)',
  ]);

  async batchFetchBalances(wallet: string, tokens: string[]): Promise<Record<string, string>> {
    try {
      // 1) Trim & validate wallet
      const userAddress = ethers.utils.getAddress(wallet.trim());

      // 2) Trim token strings and ensure proper hex format
      const rawTokens = tokens.map(t => t.trim());
      if (!rawTokens.every(t => /^0x[a-fA-F0-9]{40}$/.test(t))) {
        throw new BadRequestException('One or more token addresses have an invalid format');
      }

      // 3) Convert to checksummed addresses
      const checksummedTokens = rawTokens.map(t => ethers.utils.getAddress(t));

      // 4) Build Multicall batch of balanceOf calls
      const calls = checksummedTokens.map(addr => ({
        target: addr,
        callData: this.erc20Iface.encodeFunctionData('balanceOf', [userAddress]),
      }));

      // 5) Execute aggregate() on-chain
      const [, returnData]: [ethers.BigNumber, string[]] = await this.multicall.aggregate(calls);

      // 6) Decode each result into a string
      return checksummedTokens.reduce((out, addr, i) => {
        out[addr] = this.erc20Iface
          .decodeFunctionResult('balanceOf', returnData[i])[0]
          .toString();
        return out;
      }, {} as Record<string, string>);
    } catch (err) {
      if (err instanceof BadRequestException) throw err;
      throw new BadRequestException(`Balance fetch failed: ${err.message}`);
    }
  }
}
