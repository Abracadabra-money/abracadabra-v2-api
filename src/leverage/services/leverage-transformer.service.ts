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

        return {
            ...info,
            borrowed,
            available,
            supplied: available + borrowed,
            loopApy: info.supplyApy * 5,
            boost: 5,
        };
    }
}
