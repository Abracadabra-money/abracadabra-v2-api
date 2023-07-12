import { Injectable, OnModuleInit } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { Cron, CronExpression } from '@nestjs/schedule';
import { firstValueFrom } from 'rxjs';
import { LoggerService } from '../../logger/logger.service';

@Injectable()
export class ProtocolCoingeckoService implements OnModuleInit {
    constructor(private readonly httpService: HttpService, private readonly loggerService: LoggerService) {}

    private spellMarketCap: number;

    public onModuleInit() {
        this.loadSpellInfo().catch(() => this.loggerService.info(`Spell loading failed`));
    }

    @Cron(CronExpression.EVERY_10_MINUTES)
    public async loadSpellInfo() {
        const { data } = await firstValueFrom(this.getSpellInfo());
        this.spellMarketCap = data.market_data.market_cap.usd;
    }

    public getSpellInfo() {
        return this.httpService.get('https://api.coingecko.com/api/v3/coins/spell-token');
    }

    public getSpellMarketCap() {
        return this.spellMarketCap;
    }
}
