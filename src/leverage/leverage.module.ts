import { Module } from '@nestjs/common';
import { LeverageController } from './leverage.controller';
import { LeverageHandler } from './leverage.handler';
import { LeverageTransformerService } from './services/leverage-transformer.service';
import { LeverageService } from './services/leverage.service';

@Module({
    controllers: [LeverageController],
    providers: [LeverageHandler, LeverageTransformerService, LeverageService],
})
export class LeverageModule {}
