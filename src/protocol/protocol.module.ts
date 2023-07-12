import { Module } from '@nestjs/common';
import { ProtocolController } from './protocol.controller';
import { ProtocolHandler } from './protocol.handler';
import { ProtocolCoingeckoService } from './services/protocol-coingecko.service';
import { ProtocolService } from './services/protocol.service';
import { HttpModule } from '@nestjs/axios';

@Module({
    imports: [HttpModule],
    controllers: [ProtocolController],
    providers: [ProtocolHandler, ProtocolCoingeckoService, ProtocolService],
})
export class ProtocolModule {}
