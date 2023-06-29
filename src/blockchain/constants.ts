import { Address } from 'viem';
import { Token } from '@real-wagmi/sdk';

export enum ChainId {
    MAINNET = 1,
    FANTOM = 250,
}

export interface CauldronInfo {
    id: number;
    address: Address;
    ltv: number;
    chain: ChainId;
    name: string;
}

export const MIM = {
    [ChainId.MAINNET]: new Token(ChainId.MAINNET, '0x99d8a9c45b2eca8864373a26d1459e3dff1e17f3', 18),
    [ChainId.FANTOM]: new Token(ChainId.FANTOM, '0x82f0b8b456c1a451378467398982d4834b6829c1', 18),
};

export const cauldrons: CauldronInfo[] = [
    { id: 0, address: '0x692887E8877C6Dd31593cda44c382DB5b289B684', ltv: 70, chain: ChainId.MAINNET, name: 'mApe' }, // mApe
];

export const ADDRESSES = {
    mApe: '0xf35b31B941D94B249EaDED041DB1b05b7097fEb6',
    magicApeLensAddress: '0xefdaC7dd721985b4Bd7Fede78465fE3525b468fd',
};
