import { Injectable } from '@nestjs/common';
import { BlockchainService } from '../../blockchain/services/blockchain.service';
import { CauldronInfo, ChainId } from '../../blockchain/constants';
import { CoingeckoService } from '../../coingecko/coingecko.service';
import { getContract, parseEther } from 'viem';
import { getStargateBasicApy } from '../../utils/stargate-farm-apy';
import { mainnetStrategyLpStrategy } from '../../blockchain/abis';

@Injectable()
export class LeverageApyService {
    constructor(private readonly blockchainService: BlockchainService, private readonly coingeckoService: CoingeckoService) {}

    public async getApeApy(): Promise<number> {
        const magicApeContract = this.blockchainService.getMape();
        const magicApeLensContract = this.blockchainService.getMagicApeLens();

        const feePercentBips = await magicApeContract.read.feePercentBips();
        const BIPS = await magicApeContract.read.BIPS();
        const fee = feePercentBips / Number(BIPS);

        const apeCoinInfo = await magicApeLensContract.read.getApeCoinInfo();
        const apr = Number(apeCoinInfo.apr) / 100;
        return (Math.pow(1 + apr / 100 / 730, 730) - 1) * 100 * (1 - fee);
    }

    public async getStargateApy(cauldron: CauldronInfo): Promise<number> {
        const publicClient = this.blockchainService.getProvider(ChainId.MAINNET);
        const bentoboxContract = this.blockchainService.getBentobox(cauldron.chain, cauldron.bentoBox);

        const fetchBasicApy = async () => {
            const poolContract = this.blockchainService.getStargatePool(cauldron.chain, cauldron.collateral);
            const poolId = (await poolContract.read.poolId()) - 1n;
            const rewardPrice = await this.coingeckoService.getTokenPriceByAddress(ChainId.MAINNET, '0xAf5191B0De278C7286d6C7CC6ab6BB8A73bA2Cd6');
            const price = parseEther(String(rewardPrice));
            return await getStargateBasicApy(cauldron.collateral, poolId, price.toString());
        };

        const basicApy = (await fetchBasicApy()) * 100;

        const [, targetPercentage] = await bentoboxContract.read.strategyData([cauldron.collateral]);
        const farmingPercentage = Number(targetPercentage) / 100;

        const strategyAddress = await bentoboxContract.read.strategy([cauldron.collateral]);

        const strategyContract = getContract({ address: strategyAddress, abi: mainnetStrategyLpStrategy, publicClient });

        const fee = (await strategyContract.read.feePercent()) / 100;

        const apy = basicApy * Number(farmingPercentage) * (1 - fee);

        return apy ?? 0;
    }
}
