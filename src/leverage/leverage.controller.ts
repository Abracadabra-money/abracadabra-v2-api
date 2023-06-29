import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { LeverageHandler } from './leverage.handler';

@ApiTags('Leverage')
@Controller('leverage')
export class LeverageController {
    constructor(private readonly leverageHandler: LeverageHandler) {}

    @Get()
    public getLeverateStatistic() {
        return this.leverageHandler.getLeverateStatistic();
    }
}
