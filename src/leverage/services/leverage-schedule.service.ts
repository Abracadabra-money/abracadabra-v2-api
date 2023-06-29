import { Injectable, OnModuleInit } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { BlockchainService } from '../../blockchain/services/blockchain.service';
import { LeverageService } from './leverage.service';
import { cauldrons } from '../../blockchain/constants';
import { LeverageStoreService } from './leverage-store.service';
import { LoggerService } from '../../logger/logger.service';

@Injectable()
export class LeverageScheduleService implements OnModuleInit {
    constructor(
        private readonly blockchainService: BlockchainService,
        private readonly leverageService: LeverageService,
        private readonly leverageStoreService: LeverageStoreService,
        private readonly loggerService: LoggerService,
    ) {}

    public onModuleInit() {
        this.updateData().catch((error) => this.loggerService.error('Update leverage data', { error }));
    }

    @Cron(CronExpression.EVERY_5_MINUTES)
    public async updateData() {
        const mimPrice = await this.blockchainService.getMimPrice();

        const cauldronsInfo = await Promise.all(cauldrons.map((cauldron) => this.leverageService.getLeverateStatistic(cauldron)));

        this.leverageStoreService.updateStore(cauldronsInfo);
        this.leverageStoreService.updateMimPrice(mimPrice);
        this.loggerService.info('Leverage data updated');
    }
}
