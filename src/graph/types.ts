export interface FinancialMetric {
    feesGenerated: string;
    timestamp: string;
    totalValueLockedUsd: string;
}

export interface Protocol {
    totalValueLockedUsd: string;
    totalFeesGenerated: string;
    financialMetrics: FinancialMetric[];
}
