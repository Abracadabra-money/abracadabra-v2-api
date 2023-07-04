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
        if (cauldron.id === 1 || cauldron.id === 2) {
            return this.leverageApyService.getStargateApy(cauldron);
        }
        if (cauldron.id === 3) {
            return this.leverageApyService.getLusdApy();
        }
        //@ts-ignore
        return 0;
    }
}
