import { ChainId } from '../blockchain/constants';

export const ABRA_GRAPHS = {
    [ChainId.MAINNET]: 'https://api.studio.thegraph.com/query/4540/abra-mainnet-backup/version/latest',
    [ChainId.FANTOM]: 'http://3.66.120.254/subgraphs/name/abracadabra',
};
