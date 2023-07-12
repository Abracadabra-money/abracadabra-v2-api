import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ProtocolHandler } from './protocol.handler';

@ApiTags('Protocol')
@Controller('protocol')
export class ProtocolController {
    constructor(private readonly protocolHandler: ProtocolHandler) {}

    @Get()
    public getProtocol() {
        return this.protocolHandler.getProtocol();
    }
}
