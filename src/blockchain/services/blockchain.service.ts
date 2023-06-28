import { Injectable } from '@nestjs/common';
import { InjectEthersProvider } from 'nestjs-ethers';
import { BaseProvider } from '@ethersproject/providers';
import { ChainId } from '../constants';

@Injectable()
export class BlockchainService {
    constructor(
        @InjectEthersProvider('ftm')
        private readonly ftmProvider: BaseProvider,
        @InjectEthersProvider('eth')
        private readonly ethProvider: BaseProvider,
    ) {}

    public getProvider(chain: ChainId): BaseProvider {
        if (chain === ChainId.FANTOM) return this.ftmProvider;
        if (chain === ChainId.MAINNET) return this.ethProvider;

        throw new Error(`${chain} provider not implemented`);
    }
}
