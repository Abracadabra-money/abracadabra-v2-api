import { Address, createPublicClient, getContract, http } from 'viem';
import { mainnet } from 'viem/chains';
import { Percent, CurrencyAmount, Token } from '@real-wagmi/sdk';
import { stargatePoolAbi, stargateLpStakingAbi } from '../blockchain/abis';

const publicClient = createPublicClient({ chain: mainnet, transport: http() });
const YEAR = 31536000;

const stgToken = new Token(1, '0xAf5191B0De278C7286d6C7CC6ab6BB8A73bA2Cd6', 18);
const susdc = new Token(1, '0xdf0770dF86a8034b3EFEf0A1Bb3c889B8332FF56', 6);
/**
 * Get APR for a Farm
 * @param rewardPrice Price of STG
 * @param stgPerBlock STG Reward per block
 * @param allocPoint Weight of the pool
 * @param totalAllocPoint Total weights of all pools in the contract
 * @param avgBlockTime Average block time
 * @param totalLiquidity Total liquidity deposited in Pool
 * @param totalFarmLp Total LP in the Farm
 * @param totalPoolLp Total LP in the Pool
 * @returns APR
 */
function getFarmApr(
    rewardPrice: CurrencyAmount<Token>,
    stgPerBlock: CurrencyAmount<Token>,
    allocPoint: bigint,
    totalAllocPoint: bigint,
    avgBlockTime: number,
    totalLiquidity: CurrencyAmount<Token>,
    totalFarmLp: CurrencyAmount<Token>,
    totalPoolLp: CurrencyAmount<Token>,
) {
    const rewardPerBlock = stgPerBlock.multiply(new Percent(allocPoint * 10000n, totalAllocPoint * 10000n));
    const tvl = totalLiquidity.multiply(totalFarmLp).divide(totalPoolLp);
    const roiPerBlock = rewardPerBlock.multiply(rewardPrice).divide(tvl);
    const blocksPerYear = BigInt(Math.floor(YEAR / avgBlockTime));
    const roiPerYear = roiPerBlock.multiply(blocksPerYear);
    return parseInt(roiPerYear.toExact()) / 1e12;
}
/**
 * Get APY for a Farm
 * @param rewardPrice Price of STG
 * @param stgPerBlock STG Reward per block
 * @param allocPoint Weight of the pool
 * @param totalAllocPoint Total weights of all pools in the contract
 * @param avgBlockTime Average block time
 * @param totalLiquidity Total liquidity deposited in Pool
 * @param totalFarmLp Total LP in the Farm
 * @param totalPoolLp Total LP in the Pool
 * @returns APY
 */
function getFarmApy(
    rewardPrice: CurrencyAmount<Token>,
    stgPerBlock: CurrencyAmount<Token>,
    allocPoint: bigint,
    totalAllocPoint: bigint,
    avgBlockTime: number,
    totalLiquidity: CurrencyAmount<Token>,
    totalFarmLp: CurrencyAmount<Token>,
    totalPoolLp: CurrencyAmount<Token>,
) {
    const apr = getFarmApr(rewardPrice, stgPerBlock, allocPoint, totalAllocPoint, avgBlockTime, totalLiquidity, totalFarmLp, totalPoolLp);
    const apy = Math.E ** apr - 1;
    return apy;
}

export const getStargateBasicApy = async (poolAddress: Address, poolId: bigint, price: string) => {
    const lpStakingContract = getContract({
        address: '0xB0D502E938ed5f4df2E681fE6E419ff29631d62b',
        abi: stargateLpStakingAbi,
        publicClient,
    });
    const poolContract = getContract({ address: poolAddress, abi: stargatePoolAbi, publicClient });

    const rewardPrice = CurrencyAmount.fromRawAmount(stgToken, price);
    const stgPerBlock = CurrencyAmount.fromRawAmount(stgToken, await lpStakingContract.read.stargatePerBlock());
    const [, allocPoint] = await lpStakingContract.read.poolInfo([poolId]);
    const totalAllocPoint = await lpStakingContract.read.totalAllocPoint();
    const avgBlockTime = 13.25;
    const totalLiquidity = CurrencyAmount.fromRawAmount(susdc, await poolContract.read.totalLiquidity());
    const totalFarmLp = CurrencyAmount.fromRawAmount(susdc, await poolContract.read.balanceOf([lpStakingContract.address]));
    const totalPoolLp = CurrencyAmount.fromRawAmount(susdc, await poolContract.read.totalSupply());

    const apy = getFarmApy(rewardPrice, stgPerBlock, allocPoint, totalAllocPoint, avgBlockTime, totalLiquidity, totalFarmLp, totalPoolLp);

    return apy;
};
