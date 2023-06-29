import { Module } from '@nestjs/common';
import { LoggerModule } from './logger/logger.module';
import { BlockchainModule } from './blockchain/blockchain.module';
import { LeverageModule } from './leverage/leverage.module';

@Module({
    imports: [LoggerModule, BlockchainModule, LeverageModule],
})
export class AppModule {}
