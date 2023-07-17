import { Injectable } from '@nestjs/common';
import { ChainId } from '../../blockchain/constants';
import { GraphService } from '../../graph/services/graph.service';
import { map, combineLatestWith } from 'rxjs';
import { getPercentChange } from '../../utils/get-percent-change';
import { ProtocolCoingeckoService } from './protocol-coingecko.service';
import { HttpService } from '@nestjs/axios';
import { ABRA_FEE_URL, ABRA_TVL } from '../constants';

@Injectable()
export class ProtocolService {
    constructor(private readonly graphService: GraphService, private readonly protocolCoingeckoService: ProtocolCoingeckoService, private readonly httpService: HttpService) {}

    public getProtocolByChain(chain: ChainId) {
        if (chain === ChainId.ARBITRUM) {
            return this.getArbitrumProtocol();
        }
        return this.graphService.getAbraProtocol(chain).pipe(
            map(({ totalFeesGenerated, totalValueLockedUsd, financialMetrics }) => {
                const tvl = parseFloat(totalValueLockedUsd);
                const feesDay = parseFloat(financialMetrics[0]?.feesGenerated ?? '0');
                const feesWeek = financialMetrics.splice(0, 6).reduce((acc, { feesGenerated }) => acc + parseFloat(feesGenerated), 0);
                const feesMonth = financialMetrics.splice(0, 29).reduce((acc, { feesGenerated }) => acc + parseFloat(feesGenerated), 0);
                const feesYear = financialMetrics.reduce((acc, { feesGenerated }) => acc + parseFloat(feesGenerated), 0);
                const spellMarketCap = this.protocolCoingeckoService.getSpellMarketCap();
                return {
                    chain,
                    tvl,
                    tvlDay: getPercentChange(financialMetrics[0]?.totalValueLockedUsd, financialMetrics[1]?.totalValueLockedUsd),
                    tvlWeek: getPercentChange(financialMetrics[0]?.totalValueLockedUsd, financialMetrics[6]?.totalValueLockedUsd),
                    tvlMonth: getPercentChange(financialMetrics[0]?.totalValueLockedUsd, financialMetrics[29]?.totalValueLockedUsd),
                    feesDay,
                    feesWeek,
                    feesMonth,
                    revenueDay: feesDay,
                    revenueWeek: feesWeek,
                    revenueMounth: feesMonth,
                    userFees: feesDay / 2,
                    cumulativeFees: parseFloat(totalFeesGenerated),
                    holdersRevenue: feesDay / 2,
                    treasutyRevenue: feesDay / 2,
                    mcapToTvlRatio: spellMarketCap / tvl,
                    pf: spellMarketCap / feesYear,
                    ps: spellMarketCap / feesYear,
                };
            }),
        );
    }

    private getArbitrumProtocol() {
        const spellMarketCap = this.protocolCoingeckoService.getSpellMarketCap();
        return this.httpService
            .post(ABRA_FEE_URL, {
                network: 42161,
                group: 'network',
                rate: 'day',
            })
            .pipe(
                combineLatestWith(this.httpService.get(ABRA_TVL)),
                map(([feesRes, tvlRes]) => {
                    const tvl = tvlRes.data.networks['43114'];
                    const fees = feesRes.data.reverse();
                    const feesDay = parseFloat(fees[0]?.totalfees ?? '0');
                    const feesWeek = fees.splice(0, 6).reduce((acc, { totalfees }) => acc + parseFloat(totalfees), 0);
                    const feesMonth = fees.splice(0, 29).reduce((acc, { totalfees }) => acc + parseFloat(totalfees), 0);
                    const feesYear = fees.splice(0, 365).reduce((acc, { totalfees }) => acc + parseFloat(totalfees), 0);
                    const cumulativeFees = fees.reduce((acc, { totalfees }) => acc + parseFloat(totalfees), 0);

                    return {
                        chain: ChainId.ARBITRUM,
                        tvl,
                        feesDay,
                        feesWeek,
                        feesMonth,
                        revenueDay: feesDay,
                        revenueWeek: feesWeek,
                        revenueMounth: feesMonth,
                        userFees: feesDay / 2,
                        cumulativeFees,
                        holdersRevenue: feesDay / 2,
                        treasutyRevenue: feesDay / 2,
                        mcapToTvlRatio: spellMarketCap / tvl,
                        pf: spellMarketCap / feesYear,
                        ps: spellMarketCap / feesYear,
                    };
                }),
            );
    }
}
