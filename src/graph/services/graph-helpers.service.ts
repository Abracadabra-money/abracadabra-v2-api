import { Injectable } from '@nestjs/common';
import { ABRA_GRAPHS } from '../constants';
import { ChainId } from '../../blockchain/constants';

@Injectable()
export class GraphHelpersService {
    public getAbraGraphUrl(chain: ChainId): string {
        switch (chain) {
            default: {
                throw new Error(`${chain} not supported`);
            }

            case ChainId.FANTOM: {
                return ABRA_GRAPHS[ChainId.FANTOM];
            }

            case ChainId.MAINNET: {
                return ABRA_GRAPHS[ChainId.MAINNET];
            }
        }
    }
}
