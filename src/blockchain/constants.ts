import { Address } from 'viem';
import { Token } from '@real-wagmi/sdk';

export enum ChainId {
    MAINNET = 1,
    OPTIMISM = 10,
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
    [ChainId.OPTIMISM]: new Token(ChainId.FANTOM, '0xb153fb3d196a8eb25522705560ac152eeec57901', 18),
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
    {
        id: 4,
        address: '0x4EAeD76C3A388f4a841E9c765560BBe7B3E4B3A0',
        ltv: 90,
        chain: ChainId.MAINNET,
        name: 'cvxtricrypto2',
        bentoBox: '0xF5BCE5077908a1b7370B9ae04AdC565EBd643966',
        collateral: '0x5958A8DB7dfE0CC49382209069b00F54e17929C2',
    },
    {
        id: 5,
        address: '0x806e16ec797c69afa8590A55723CE4CC1b54050E',
        ltv: 90,
        chain: ChainId.MAINNET,
        name: 'cvx3pool',
        bentoBox: '0xF5BCE5077908a1b7370B9ae04AdC565EBd643966',
        collateral: '0xd92494CB921E5C0d3A39eA88d0147bbd82E51008',
    },
    {
        id: 6,
        address: '0x6371EfE5CD6e3d2d7C477935b7669401143b7985',
        ltv: 92,
        chain: ChainId.MAINNET,
        name: 'cvx3pool',
        bentoBox: '0xF5BCE5077908a1b7370B9ae04AdC565EBd643966',
        collateral: '0xd92494CB921E5C0d3A39eA88d0147bbd82E51008',
    },
    {
        id: 7,
        address: '0x257101F20cB7243E2c7129773eD5dBBcef8B34E0',
        ltv: 92,
        chain: ChainId.MAINNET,
        name: 'cvx3pool',
        bentoBox: '0xF5BCE5077908a1b7370B9ae04AdC565EBd643966',
        collateral: '0x3Ba207c25A278524e1cC7FaAea950753049072A4',
    },
    {
        id: 8,
        address: '0x68f498C230015254AFF0E1EB6F85Da558dFf2362',
        ltv: 70,
        chain: ChainId.OPTIMISM,
        name: 'Velodrome Volatile OP/USDC',
        bentoBox: '0xa93c81f564579381116ee3e007c9fcfd2eba1723',
        collateral: '0x6eb1709e0b562097bf1cc48bc6a378446c297c04',
    },
    {
        id: 9,
        address: '0x920D9BD936Da4eAFb5E25c6bDC9f6CB528953F9f',
        ltv: 80,
        chain: ChainId.MAINNET,
        name: 'yvWETH v2',
        bentoBox: '0xF5BCE5077908a1b7370B9ae04AdC565EBd643966',
        collateral: '0xa258C4606Ca8206D8aA700cE2143D7db854D168c',
    },
    {
        id: 10,
        address: '0xEBfDe87310dc22404d918058FAa4D56DC4E93f0A',
        ltv: 90,
        chain: ChainId.MAINNET,
        name: 'yvcrvIB',
        bentoBox: '0xF5BCE5077908a1b7370B9ae04AdC565EBd643966',
        collateral: '0x27b7b1ad7288079A66d12350c828D3C00A6F07d7',
    },
    {
        id: 11,
        address: '0xf179fe36a36B32a4644587B8cdee7A23af98ed37',
        ltv: 75,
        chain: ChainId.MAINNET,
        name: 'yvCVXETH',
        bentoBox: '0xd96f48665a1410C0cd669A88898ecA36B9Fc2cce',
        collateral: '0x1635b506a88fBF428465Ad65d00e8d6B6E5846C3',
    },
    {
        id: 12,
        address: '0x7Ce7D9ED62B9A6c5aCe1c6Ec9aeb115FA3064757',
        ltv: 98,
        chain: ChainId.MAINNET,
        name: 'yvDAI',
        bentoBox: '0xd96f48665a1410C0cd669A88898ecA36B9Fc2cce',
        collateral: '0xdA816459F1AB5631232FE5e97a05BBBb94970c95',
    },
    {
        id: 13,
        address: '0x53375adD9D2dFE19398eD65BAaEFfe622760A9A6',
        ltv: 75,
        chain: ChainId.MAINNET,
        name: 'yvcrvSTETH Concentrated',
        bentoBox: '0xd96f48665a1410C0cd669A88898ecA36B9Fc2cce',
        collateral: '0x5faF6a2D186448Dfa667c51CB3D695c7A6E52d8E',
    },
    {
        id: 14,
        address: '0x406b89138782851d3a8C04C743b010CEb0374352',
        ltv: 75,
        chain: ChainId.MAINNET,
        name: 'yvcrvSTETH',
        bentoBox: '0xd96f48665a1410C0cd669A88898ecA36B9Fc2cce',
        collateral: '0xdCD90C7f6324cfa40d7169ef80b12031770B4325',
    },
    {
        id: 15,
        address: '0x7259e152103756e1616A77Ae982353c3751A6a90',
        ltv: 75,
        chain: ChainId.MAINNET,
        name: 'yv-3Crypto',
        bentoBox: '0xd96f48665a1410C0cd669A88898ecA36B9Fc2cce',
        collateral: '0x8078198Fc424986ae89Ce4a910Fc109587b6aBF3',
    },
];

export const ADDRESSES = {
    mApe: '0xf35b31B941D94B249EaDED041DB1b05b7097fEb6',
    magicApeLensAddress: '0xefdaC7dd721985b4Bd7Fede78465fE3525b468fd',
};
