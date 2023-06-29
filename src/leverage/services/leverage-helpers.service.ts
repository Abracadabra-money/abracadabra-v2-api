import { Injectable } from '@nestjs/common';
import { CauldronInfo } from '../../blockchain/constants';
import { LeverageApyService } from './leverage-apy.service';

@Injectable()
export class LeverageHelpersService {
    constructor(private readonly leverageApyService: LeverageApyService) {}

    public getApy(cauldron: CauldronInfo): Promise<number> {
        if (cauldron.id === 0) {
            return this.leverageApyService.getApeApy();
        }
        //@ts-ignore
        return 0;
    }
}
