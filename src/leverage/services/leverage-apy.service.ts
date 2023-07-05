import { Injectable } from '@nestjs/common';
import { BlockchainService } from '../../blockchain/services/blockchain.service';
import { CauldronInfo, ChainId } from '../../blockchain/constants';
import { CoingeckoService } from '../../coingecko/coingecko.service';
import { getContract, parseEther, formatUnits, Address, formatEther, parseUnits } from 'viem';
import { getStargateBasicApy } from '../../utils/stargate-farm-apy';
import { mainnetStrategyLpStrategy, communityIssuacneLusdAbi, stabilityPoolLusd, crvRewardPoolAbi, cvxTokenAbi, solidlyGaugeVolatileLPStrategyAbi } from '../../blockchain/abis';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class LeverageApyService {
    constructor(private readonly blockchainService: BlockchainService, private readonly coingeckoService: CoingeckoService, private readonly httpService: HttpService) {}

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

    public async getLusdApy(): Promise<number> {
        const communityIssuanceAddress = '0xD8c9D9071123a059C6E0A945cF0e0c82b508d816';
        const stabilityPoolAddress = '0x66017D22b0f8556afDd19FC67041899Eb65a21bb';

        const publicClient = this.blockchainService.getProvider(ChainId.MAINNET);

        const communityIssuanceContract = getContract({
            address: communityIssuanceAddress,
            abi: communityIssuacneLusdAbi,
            publicClient,
        });

        const stabilityPoolContract = getContract({
            address: stabilityPoolAddress,
            abi: stabilityPoolLusd,
            publicClient,
        });

        const lqtyPrice = await this.coingeckoService.getTokenPriceByAddress(ChainId.MAINNET, '0x6dea81c8171d0ba574754ef6f8b412f2ed88c54d');

        const totalLQTYIssued = await communityIssuanceContract.read.totalLQTYIssued();
        const issuanceCap = await communityIssuanceContract.read.LQTYSupplyCap();

        const remainingStabilityPoolLQTYReward = formatUnits(issuanceCap - totalLQTYIssued, 18);

        const lusdInStabilityPool = formatUnits(await stabilityPoolContract.read.getTotalLUSDDeposits(), 18);

        const yearlyIssuanceFraction = 0.5;
        const dailyIssuanceFraction = 1 - yearlyIssuanceFraction ** (1 / 365);

        const lqtyIssuanceOneDay = +remainingStabilityPoolLQTYReward * dailyIssuanceFraction;

        const lqtyIssuanceOneDayInUSD = lqtyIssuanceOneDay * lqtyPrice;

        const aprPercentageBase = (lqtyIssuanceOneDayInUSD * (365 * 100)) / +lusdInStabilityPool;

        const apr = aprPercentageBase * 0.95;

        return apr;
    }

    public async getCrvApy(cauldron: CauldronInfo, baseRewardPool: Address): Promise<number> {
        const publicClient = this.blockchainService.getProvider(cauldron.chain);
        const cauldronContract = this.blockchainService.getCauldron(cauldron.chain, cauldron.address);
        const tokenRate = await cauldronContract.read.exchangeRate();

        const crvRewardPoolContract = getContract({
            address: baseRewardPool,
            abi: crvRewardPoolAbi,
            publicClient,
        });

        const rewardRate = await crvRewardPoolContract.read.rewardRate();

        const totalSupply = await crvRewardPoolContract.read.totalSupply();

        const tokenIn1000Usd = 1000n * tokenRate;

        const secondsPerYear = 31536000;

        const crvReward = (Number(rewardRate) / Number(totalSupply)) * Number(tokenIn1000Usd) * secondsPerYear;

        const convertCrvToCvx = async (amount: number): Promise<number> => {
            let _amount = parseUnits(amount.toFixed(18), 18);

            const cvxTokenContract = getContract({
                address: '0x4e3fbd56cd56c3e72c1403e103b45db9da5b9d2b',
                abi: cvxTokenAbi,
                publicClient,
            });

            const supply = await cvxTokenContract.read.totalSupply();
            const reductionPerCliff = await cvxTokenContract.read.reductionPerCliff();
            const totalCliffs = await cvxTokenContract.read.totalCliffs();
            const maxSupply = await cvxTokenContract.read.maxSupply();

            const cliff = supply / reductionPerCliff;
            //mint if below total cliffs
            if (cliff < totalCliffs) {
                //for reduction% take inverse of current cliff
                const reduction = totalCliffs - cliff;
                //reduce
                _amount = (_amount * reduction) / totalCliffs;
                //supply cap check
                const amtTillMax = maxSupply - supply;
                if (_amount > amtTillMax) {
                    _amount = amtTillMax;
                }
                //mint
                return Number(_amount);
            }
            return 0;
        };

        const cvxReward = await convertCrvToCvx(crvReward);

        const parsedCvxReward = formatEther(BigInt(cvxReward));

        const crvPrice = await this.coingeckoService.getTokenPriceByAddress(ChainId.MAINNET, '0xD533a949740bb3306d119CC777fa900bA034cd52');
        const cvxPrice = await this.coingeckoService.getTokenPriceByAddress(ChainId.FANTOM, '0x4e3FBD56CD56c3e72c1403e103b45Db9da5B9D2B');
        const apy = (crvReward * crvPrice + parseFloat(parsedCvxReward) * cvxPrice) / 10;

        return apy / Math.pow(10, 18);
    }

    public async getVeloApy(cauldron: CauldronInfo): Promise<number> {
        const { data } = await firstValueFrom(this.httpService.get('https://api.velodrome.finance/api/v1/pairs'));

        const opusdcPair = data.data.find((pair) => pair.symbol === 'vAMM-OP/USDC');

        const APYVault: number = opusdcPair.apr;

        const bentoboxContract = this.blockchainService.getBentobox(cauldron.chain, cauldron.bentoBox);
        const [, targetPercentage] = await bentoboxContract.read.strategyData([cauldron.collateral]);
        const percentage = Number(targetPercentage) / 100;

        const getVeloManagementFee = async () => {
            const strategyAddress = await bentoboxContract.read.strategy([cauldron.collateral]);
            const publicClient = this.blockchainService.getProvider(cauldron.chain);

            const strategy = getContract({
                address: strategyAddress,
                abi: solidlyGaugeVolatileLPStrategyAbi,
                publicClient,
            });

            return await strategy.read.feePercent();
        };

        const stratPercentage = (await getVeloManagementFee()) / 100;

        const apy = APYVault * percentage * (1 - stratPercentage);

        return apy;
    }
}
