import { Injectable } from '@nestjs/common';
import { CauldronInfo } from '../../blockchain/constants';
import { ICauldronStatistic } from '../services/leverage-transformer.service';
import { BlockchainService } from '../../blockchain/services/blockchain.service';
import { LeverageHelpersService } from './leverage-helpers.service';

@Injectable()
export class LeverageService {
    constructor(private readonly blockchainService: BlockchainService, private readonly leverageHelpersService: LeverageHelpersService) {}

    public async getLeverateStatistic(cauldron: CauldronInfo): Promise<ICauldronStatistic> {
        const borrowed = await this.blockchainService.getMimBorrowed(cauldron.chain, cauldron.address);
        const available = await this.blockchainService.getMimCauldronBalance(cauldron.chain, cauldron.address);
        const supplyApy = await this.leverageHelpersService.getApy(cauldron);

        return {
            ...cauldron,
            borrowed,
            available,
            supplyApy,
        };
    }
}
