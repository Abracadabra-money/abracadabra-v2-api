import { Injectable } from '@nestjs/common';
import { ChainId } from '../../blockchain/constants';
import { GraphService } from '../../graph/services/graph.service';
import { map } from 'rxjs';
import { getPercentChange } from '../../utils/get-percent-change';
import { ProtocolCoingeckoService } from './protocol-coingecko.service';

@Injectable()
export class ProtocolService {
    constructor(private readonly graphService: GraphService, private readonly protocolCoingeckoService: ProtocolCoingeckoService) {}

    public getProtocolByChain(chain: ChainId) {
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
}
