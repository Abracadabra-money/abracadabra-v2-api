import { Injectable } from '@nestjs/common';
import { config, apiDomain, chainCoinGeckoIds } from './constants';
import { ChainId } from '../blockchain/constants';
import { Address } from 'viem';
import { LoggerService } from '../logger/logger.service';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class CoingeckoService {
    constructor(private readonly loggerService: LoggerService, private readonly httpService: HttpService) {}

    public async getTokenPriceByAddress(chainId: ChainId, address: Address): Promise<number> {
        try {
            const chainCoinGeckoId = chainCoinGeckoIds[chainId];

            if (!chainCoinGeckoId) return 0;

            const pricesResponse = await firstValueFrom(
                this.httpService.get(`https://${apiDomain}/api/v3/simple/token_price/${chainCoinGeckoId}?contract_addresses=${address}&vs_currencies=usd`, config),
            );

            let price = null;

            for (const property in pricesResponse.data) {
                price = pricesResponse.data[property]?.usd;
            }

            return price;
        } catch (error) {
            this.loggerService.info('TOKEN PRICE ERR:', { error });
            return 0;
        }
    }
}
