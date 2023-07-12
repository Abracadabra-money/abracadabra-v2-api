import { Injectable } from '@nestjs/common';

@Injectable()
export class GraphGqlService {
    public getProtocol(): string {
        return `{
            protocols {
              totalValueLockedUsd
              totalFeesGenerated
              financialMetrics(orderBy: timestamp, orderDirection: desc, first: 365) {
                feesGenerated
                timestamp
                totalValueLockedUsd
              }
            }
          }`;
    }
}
