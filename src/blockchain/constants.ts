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
    bentoBox: Address;
    collateral: Address;
}

export const MIM = {
    [ChainId.MAINNET]: new Token(ChainId.MAINNET, '0x99d8a9c45b2eca8864373a26d1459e3dff1e17f3', 18),
    [ChainId.FANTOM]: new Token(ChainId.FANTOM, '0x82f0b8b456c1a451378467398982d4834b6829c1', 18),
};

export const cauldrons: CauldronInfo[] = [
    {
        id: 0,
        address: '0x692887E8877C6Dd31593cda44c382DB5b289B684',
        ltv: 70,
        chain: ChainId.MAINNET,
        name: 'mApe',
        bentoBox: '0xd96f48665a1410C0cd669A88898ecA36B9Fc2cce',
        collateral: '0xf35b31B941D94B249EaDED041DB1b05b7097fEb6',
    },
    {
        id: 1,
        address: '0xd31E19A0574dBF09310c3B06f3416661B4Dc7324',
        ltv: 98,
        chain: ChainId.MAINNET,
        name: 'Stargate USDC',
        bentoBox: '0xd96f48665a1410C0cd669A88898ecA36B9Fc2cce',
        collateral: '0xdf0770dF86a8034b3EFEf0A1Bb3c889B8332FF56',
    },
    {
        id: 2,
        address: '0xc6B2b3fE7c3D7a6f823D9106E22e66660709001e',
        ltv: 98,
        chain: ChainId.MAINNET,
        name: 'Stargate USDT',
        bentoBox: '0xd96f48665a1410C0cd669A88898ecA36B9Fc2cce',
        collateral: '0x38EA452219524Bb87e18dE1C24D3bB59510BD783',
    },
    {
        id: 3,
        address: '0x8227965A7f42956549aFaEc319F4E444aa438Df5',
        ltv: 95,
        chain: ChainId.MAINNET,
        name: 'LUSD',
        bentoBox: '0xd96f48665a1410C0cd669A88898ecA36B9Fc2cce',
        collateral: '0x5f98805A4E8be255a32880FDeC7F6728C6568bA0',
    },
];

export const ADDRESSES = {
    mApe: '0xf35b31B941D94B249EaDED041DB1b05b7097fEb6',
    magicApeLensAddress: '0xefdaC7dd721985b4Bd7Fede78465fE3525b468fd',
};
