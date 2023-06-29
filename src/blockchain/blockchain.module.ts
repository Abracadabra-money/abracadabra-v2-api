import { Global, Module } from '@nestjs/common';
import { BlockchainService } from './services/blockchain.service';
import { BlockchainUtilsService } from './services/blockchain-utils.sevice';

@Global()
@Module({
    providers: [BlockchainService, BlockchainUtilsService],
    exports: [BlockchainService],
})
export class BlockchainModule {}
