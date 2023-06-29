import { Injectable } from '@nestjs/common';
import { BlockchainService } from '../../blockchain/services/blockchain.service';

@Injectable()
export class LeverageApyService {
    constructor(private readonly blockchainService: BlockchainService) {}

    public async getApeApy() {
        const magicApeContract = this.blockchainService.getMape();
        const magicApeLensContract = this.blockchainService.getMagicApeLens();

        const feePercentBips = await magicApeContract.read.feePercentBips();
        const BIPS = await magicApeContract.read.BIPS();
        const fee = feePercentBips / Number(BIPS);

        const apeCoinInfo = await magicApeLensContract.read.getApeCoinInfo();
        const apr = Number(apeCoinInfo.apr) / 100;
        return (Math.pow(1 + apr / 100 / 730, 730) - 1) * 100 * (1 - fee);
    }
}
