import { Module } from '@nestjs/common';
import { LoggerModule } from './logger/logger.module';
import { BlockchainModule } from './blockchain/blockchain.module';

@Module({
    imports: [LoggerModule, BlockchainModule],
})
export class AppModule {}
