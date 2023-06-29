import { Module } from '@nestjs/common';
import { LeverageController } from './leverage.controller';
import { LeverageHandler } from './leverage.handler';
import { LeverageTransformerService } from './services/leverage-transformer.service';
import { LeverageService } from './services/leverage.service';
import { LeverageApyService } from './services/leverage-apy.service';
import { LeverageHelpersService } from './services/leverage-helpers.service';
import { LeverageStoreService } from './services/leverage-store.service';
import { LeverageScheduleService } from './services/leverage-Schedule.service';

@Module({
    controllers: [LeverageController],
    providers: [LeverageHandler, LeverageTransformerService, LeverageService, LeverageApyService, LeverageHelpersService, LeverageStoreService, LeverageScheduleService],
})
export class LeverageModule {}
