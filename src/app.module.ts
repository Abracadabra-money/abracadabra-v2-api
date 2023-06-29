import { Module } from '@nestjs/common';
import { LoggerModule } from './logger/logger.module';
import { BlockchainModule } from './blockchain/blockchain.module';
import { LeverageModule } from './leverage/leverage.module';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
    imports: [LoggerModule, BlockchainModule, LeverageModule, ScheduleModule.forRoot()],
})
export class AppModule {}
