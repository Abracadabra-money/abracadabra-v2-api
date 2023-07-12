import { Module } from '@nestjs/common';
import { LoggerModule } from './logger/logger.module';
import { BlockchainModule } from './blockchain/blockchain.module';
import { LeverageModule } from './leverage/leverage.module';
import { ScheduleModule } from '@nestjs/schedule';
import { ProtocolModule } from './protocol/protocol.module';
import { GraphModule } from './graph/graph.module';

@Module({
    imports: [LoggerModule, BlockchainModule, LeverageModule, ScheduleModule.forRoot(), ProtocolModule, GraphModule],
})
export class AppModule {}
