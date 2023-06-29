import { Injectable } from '@nestjs/common';
import { cauldrons } from '../blockchain/constants';
import { LeverageTransformerService } from './services/leverage-transformer.service';
import { BlockchainService } from '../blockchain/services/blockchain.service';
import { LeverageService } from './services/leverage.service';

@Injectable()
export class LeverageHandler {
    constructor(
        private readonly leverageTransformerService: LeverageTransformerService,
        private readonly blockchainService: BlockchainService,
        private readonly leverageService: LeverageService,
    ) {}

    public async getLeverateStatistic() {
        const mimPrice = await this.blockchainService.getMimPrice();

        const cauldronsInfo = await Promise.all(cauldrons.map((cauldron) => this.leverageService.getLeverateStatistic(cauldron)));

        return cauldronsInfo.map((info) => this.leverageTransformerService.toStatistic(info, mimPrice));
    }
}
