import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { CoingeckoService } from './coingecko.service';

@Module({
    imports: [HttpModule],
    providers: [CoingeckoService],
    exports: [CoingeckoService],
})
export class CoingeckoModule {}
