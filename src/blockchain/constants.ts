import { EthersModuleOptions } from 'nestjs-ethers';

import { FTM_RPC, ETH_RPC } from '../env';

export enum ChainId {
    MAINNET = 1,
    FANTOM = 250,
}

export const ethersModules: EthersModuleOptions[] = [
    {
        token: 'ftm',
        network: ChainId.FANTOM,
        useDefaultProvider: false,
        custom: FTM_RPC,
    },
    {
        token: 'eth',
        network: ChainId.MAINNET,
        useDefaultProvider: false,
        custom: ETH_RPC,
    },
];