import { Injectable } from '@nestjs/common';
import { ChainId, MIM } from '../constants';
import { Token } from '@real-wagmi/sdk';

@Injectable()
export class BlockchainUtilsService {
    public getMim(chainId: ChainId): Token {
        return MIM[chainId];
    }
}
