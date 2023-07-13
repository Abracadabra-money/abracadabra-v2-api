import { Injectable } from '@nestjs/common';
import { ChainId, ADDRESSES } from '../constants';
import { createPublicClient, http, PublicClient, Chain, HttpTransport, getContract, Address, formatUnits } from 'viem';
import { mainnet, fantom, optimism, arbitrum } from 'viem/chains';
import { cauldronAbi, bentoboxAbi, mimPriceAbi, mapeAbi, magicApeLens, stargatePoolAbi } from '../abis';
import { BlockchainUtilsService } from './blockchain-utils.sevice';
import { CurrencyAmount, Token } from '@real-wagmi/sdk';

const viemProviders = {
    [ChainId.FANTOM]: createPublicClient({ chain: fantom, transport: http() }),
    [ChainId.MAINNET]: createPublicClient({ chain: mainnet, transport: http() }),
    [ChainId.OPTIMISM]: createPublicClient({ chain: { ...optimism, rpcUrls: { ...optimism.rpcUrls, default: { http: ['https://optimism.publicnode.com'] } } }, transport: http() }),
    [ChainId.ARBITRUM]: createPublicClient({ chain: arbitrum, transport: http() })
}

@Injectable()
export class BlockchainService {
    constructor(private readonly blockchainUtilsService: BlockchainUtilsService) {}

    public getProvider(chainId: ChainId): PublicClient<HttpTransport, Chain> {
        if(!viemProviders[chainId]){
            throw new Error(`${chainId} provider not implemented`);
        }
        return viemProviders[chainId];
    }

    public getCauldron(chainId: ChainId, address: Address) {
        const publicClient = this.getProvider(chainId);
        return getContract({
            address,
            abi: cauldronAbi,
            publicClient,
        });
    }

    public getBentobox(chainId: ChainId, address: Address) {
        const publicClient = this.getProvider(chainId);
        return getContract({
            address,
            abi: bentoboxAbi,
            publicClient,
        });
    }

    public async getMimPrice(): Promise<number> {
        const publicClient = this.getProvider(ChainId.MAINNET);
        const mimPriceContract = getContract({
            address: '0x7A364e8770418566e3eb2001A96116E6138Eb32F',
            abi: mimPriceAbi,
            publicClient,
        });

        const price = await mimPriceContract.read.latestAnswer();
        return parseFloat(formatUnits(price, 8));
    }

    public async getMimCauldronBalance(chainId: ChainId, cauldronAddress: Address): Promise<CurrencyAmount<Token>> {
        const mim = this.blockchainUtilsService.getMim(chainId);
        const cauldron = this.getCauldron(chainId, cauldronAddress);
        const bentoBoxAddress = await cauldron.read.bentoBox();
        const bentobox = this.getBentobox(chainId, bentoBoxAddress);
        const cauldronBalance = await bentobox.read.balanceOf([mim.address, cauldronAddress]);
        const toAmount = await bentobox.read.toAmount([mim.address, cauldronBalance, false]);
        return CurrencyAmount.fromRawAmount<Token>(mim, toAmount);
    }

    public async getMimBorrowed(chainId: ChainId, cauldronAddress: Address): Promise<CurrencyAmount<Token>> {
        const mim = this.blockchainUtilsService.getMim(chainId);
        const cauldron = this.getCauldron(chainId, cauldronAddress);
        const [elastic] = await cauldron.read.totalBorrow();
        return CurrencyAmount.fromRawAmount(mim, elastic);
    }

    public getMape() {
        const publicClient = this.getProvider(ChainId.MAINNET);
        return getContract({
            address: ADDRESSES.mApe as Address,
            abi: mapeAbi,
            publicClient,
        });
    }

    public getMagicApeLens() {
        const publicClient = this.getProvider(ChainId.MAINNET);
        return getContract({
            address: ADDRESSES.magicApeLensAddress as Address,
            abi: magicApeLens,
            publicClient,
        });
    }

    public getStargatePool(chainId: ChainId, address: Address) {
        const publicClient = this.getProvider(chainId);
        return getContract({
            address,
            abi: stargatePoolAbi,
            publicClient,
        });
    }
}
