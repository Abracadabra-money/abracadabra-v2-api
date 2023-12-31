import { Injectable } from '@nestjs/common';
import { CauldronInfo } from '../../blockchain/constants';
import { CurrencyAmount, Token } from '@real-wagmi/sdk';

export interface ICauldronStatistic extends CauldronInfo {
    borrowed: CurrencyAmount<Token>;
    available: CurrencyAmount<Token>;
    supplyApy: number;
}

@Injectable()
export class LeverageTransformerService {
    public toStatistic(info: ICauldronStatistic, mimPrice: number) {
        const borrowed = parseFloat(info.borrowed.toExact()) * mimPrice;
        const available = parseFloat(info.available.toExact()) * mimPrice;

        const boost = info.id === 16 || info.id === 17 ? 4 : 5;

        return {
            address: info.address,
            ltv: info.ltv,
            chain: info.chain,
            name: info.name,
            borrowed,
            available,
            supplyApy: info.supplyApy,
            supplied: available + borrowed,
            loopApy: info.supplyApy * boost,
            boost,
        };
    }
}
