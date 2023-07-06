import { Injectable } from '@nestjs/common';
import { BlockchainService } from '../../blockchain/services/blockchain.service';
import { HttpService } from '@nestjs/axios';
import { getContract } from 'viem';
import {
    rewardReaderAddress,
    rewardTrackersForStakingInfo,
    glpManagerAddress,
    uniswapGmxEthPool,
    weth,
    gmx,
    vault,
    nativeToken,
    readerAddress,
    walletTokens,
    GmxGlpWrapperAddress,
    MagicGlpHarvestorAddress,
} from '../constants/glp';
import { glpRewardReaderAbi, glpManagerAbi, uniPoolAbi, glpVaultAbi, glpReaderV2, abraWsGlpAbi, magicGlpHarvestorAbi } from '../../blockchain/abis';
import { ChainId } from '../../blockchain/constants';
import { getRandomAddress } from '../../utils/get-random-address';
import { Token } from '@real-wagmi/sdk';
import { Pool } from '@real-wagmi/v3-sdk';
import { expandDecimals, parseValue } from '../../utils/glp-utils';

@Injectable()
export class LeverageGlpHelpers {
    constructor(private readonly blockchainService: BlockchainService, private readonly httpService: HttpService) {}

    private getStakingInfo() {
        const publicClient = this.blockchainService.getProvider(ChainId.ARBITRUM);
        const contract = getContract({
            address: rewardReaderAddress,
            abi: glpRewardReaderAbi,
            publicClient,
        });
        return contract.read.getStakingInfo([getRandomAddress(), rewardTrackersForStakingInfo]);
    }

    public async getStakingData() {
        const stakingInfo = await this.getStakingInfo();

        const keys = ['stakedGmxTracker', 'bonusGmxTracker', 'feeGmxTracker', 'stakedGlpTracker', 'feeGlpTracker'];
        const data = {};
        const propsLength = 5;

        for (let i = 0; i < keys.length; i++) {
            const key = keys[i];
            data[key] = {
                claimable: stakingInfo[i * propsLength],
                tokensPerInterval: stakingInfo[i * propsLength + 1],
                averageStakedAmounts: stakingInfo[i * propsLength + 2],
                cumulativeRewards: stakingInfo[i * propsLength + 3],
                totalSupply: stakingInfo[i * propsLength + 4],
            };
        }

        return data;
    }

    public async getAum() {
        const publicClient = this.blockchainService.getProvider(ChainId.ARBITRUM);
        const glpManagerContract = getContract({
            address: glpManagerAddress,
            abi: glpManagerAbi,
            publicClient,
        });
        const [aum0, aum1] = await glpManagerContract.read.getAums();
        return aum0 + aum1 / 2n;
    }

    public async getGmxPrice() {
        const publicClient = this.blockchainService.getProvider(ChainId.ARBITRUM);
        const poolContract = getContract({
            address: uniswapGmxEthPool,
            abi: uniPoolAbi,
            publicClient,
        });
        const [sqrtPriceX96, tick] = await poolContract.read.slot0();

        const vaultContract = getContract({
            address: vault,
            abi: glpVaultAbi,
            publicClient,
        });
        const ethPrice = await vaultContract.read.getMinPrice([weth]);

        const tokenA = new Token(ChainId.ARBITRUM, weth, 18);
        const tokenB = new Token(ChainId.ARBITRUM, gmx, 18);

        const pool = new Pool(
            tokenA, // tokenA
            tokenB, // tokenB
            10000, // fee
            sqrtPriceX96, // sqrtRatioX96
            1, // liquidity
            tick, // tickCurrent
            [],
        );

        const poolTokenPrice = pool.priceOf(tokenB).toSignificant(6);
        const poolTokenPriceAmount = parseValue(poolTokenPrice, 18);
        return (poolTokenPriceAmount * ethPrice) / expandDecimals(1, 18);
    }

    public async getNativeTokenPrice() {
        const publicClient = this.blockchainService.getProvider(ChainId.ARBITRUM);
        const vaultContract = getContract({
            address: vault,
            abi: glpVaultAbi,
            publicClient,
        });
        return vaultContract.read.getMinPrice([nativeToken]);
    }

    private getBalances() {
        const publicClient = this.blockchainService.getProvider(ChainId.ARBITRUM);
        const contract = getContract({
            address: readerAddress,
            abi: glpReaderV2,
            publicClient,
        });
        return contract.read.getTokenBalancesWithSupplies([getRandomAddress(), walletTokens]);
    }

    public async getBalanceAndSupplyData() {
        const balances = await this.getBalances();
        const keys = ['gmx', 'esGmx', 'glp', 'stakedGmxTracker'];
        const balanceData = {};
        const supplyData = {};
        const propsLength = 2;

        for (let i = 0; i < keys.length; i++) {
            const key = keys[i];
            balanceData[key] = balances[i * propsLength];
            supplyData[key] = balances[i * propsLength + 1];
        }

        return { balanceData, supplyData };
    }

    public async getFeePercent() {
        const publicClient = this.blockchainService.getProvider(ChainId.ARBITRUM);
        const contract = getContract({
            address: GmxGlpWrapperAddress,
            abi: abraWsGlpAbi,
            publicClient,
        });
        return contract.read.feePercent();
    }

    public async getMagicFeePercent() {
        const publicClient = this.blockchainService.getProvider(ChainId.ARBITRUM);
        const contract = getContract({
            address: MagicGlpHarvestorAddress,
            abi: magicGlpHarvestorAbi,
            publicClient,
        });
        return contract.read.feePercentBips();
    }
}
