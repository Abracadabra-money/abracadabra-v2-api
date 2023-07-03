import { COINGECKO_API_KEY } from '../env';
import { ChainId } from '../blockchain/constants';

export const chainCoinGeckoIds = {
    [ChainId.MAINNET]: 'ethereum',
    [ChainId.FANTOM]: 'fantom',
};

export const apiDomain = COINGECKO_API_KEY ? 'pro-api.coingecko.com' : 'api.coingecko.com';

export const config = {
    headers: {
        'X-Cg-Pro-Api-Key': COINGECKO_API_KEY,
    },
};
