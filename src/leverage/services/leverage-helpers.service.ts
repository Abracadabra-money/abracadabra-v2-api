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
        if (cauldron.id === 4) {
            return this.leverageApyService.getCrvApy(cauldron, '0x9d5c5e364d81dab193b72db9e9be9d8ee669b652');
        }
        if (cauldron.id === 5 || cauldron.id === 6 || cauldron.id === 7) {
            return this.leverageApyService.getCrvApy(cauldron, '0x689440f2Ff927E1f24c72F1087E1FAF471eCe1c8');
        }
        if (cauldron.id === 8) {
            return this.leverageApyService.getVeloApy(cauldron);
        }
        //@ts-ignore
        return 0;
    }
}
