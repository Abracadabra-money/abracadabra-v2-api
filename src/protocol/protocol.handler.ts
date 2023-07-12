import { Injectable } from '@nestjs/common';
import { availableChains } from './constants';
import { ProtocolService } from './services/protocol.service';
import { from, mergeMap, reduce } from 'rxjs';

@Injectable()
export class ProtocolHandler {
    constructor(private readonly protocolService: ProtocolService) {}

    public getProtocol() {
        return from(availableChains).pipe(
            mergeMap((chainId) => this.protocolService.getProtocolByChain(chainId)),
            reduce((acc, res) => acc.concat([res]), []),
        );
    }
}
