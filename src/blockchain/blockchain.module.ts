import { Global, Module } from '@nestjs/common';
import { EthersModule } from 'nestjs-ethers';

import { ethersModules } from './constants';
import { BlockchainService } from './services/blockchain.service';

const PROVIDERS = [BlockchainService];

@Global()
@Module({
    imports: [...ethersModules.map((config) => EthersModule.forRoot(config))],
    providers: PROVIDERS,
    exports: PROVIDERS,
})
export class BlockchainModule {}
