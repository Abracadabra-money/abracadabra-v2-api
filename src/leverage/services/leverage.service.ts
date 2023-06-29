import { Injectable } from '@nestjs/common';
import { CauldronInfo } from '../../blockchain/constants';
import { ICauldronStatistic } from '../services/leverage-transformer.service';
import { BlockchainService } from '../../blockchain/services/blockchain.service';

@Injectable()
export class LeverageService {
    constructor(private readonly blockchainService: BlockchainService) {}

    public async getLeverateStatistic(cauldron: CauldronInfo): Promise<ICauldronStatistic> {
        const borrowed = await this.blockchainService.getMimBorrowed(cauldron.chain, cauldron.address);
        const available = await this.blockchainService.getMimCauldronBalance(cauldron.chain, cauldron.address);

        return {
            ...cauldron,
            borrowed,
            available,
            supplyApy: 0,
        };
    }
}
