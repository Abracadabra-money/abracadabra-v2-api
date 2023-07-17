import { Injectable } from '@nestjs/common';
import { LeverageStoreService } from './services/leverage-store.service';
import { LeverageTransformerService } from './services/leverage-transformer.service';

@Injectable()
export class LeverageHandler {
    constructor(private readonly leverageStoreService: LeverageStoreService, private readonly leverageTransformerService: LeverageTransformerService) {}

    public async getLeverateStatistic() {
        const cauldronsInfo = this.leverageStoreService.getData();
        const mimPrice = this.leverageStoreService.getMimPrice();

        return cauldronsInfo.map((info) => this.leverageTransformerService.toStatistic(info, mimPrice));
    }
}
