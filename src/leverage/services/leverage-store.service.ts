import { Injectable } from '@nestjs/common';
import { ICauldronStatistic } from '../services/leverage-transformer.service';

@Injectable()
export class LeverageStoreService {
    private data: ICauldronStatistic[] = [];
    private mimPrice = 1;

    public updateStore(newData: ICauldronStatistic[]) {
        this.data = newData;
    }

    public getData(): ICauldronStatistic[] {
        return this.data;
    }

    public updateMimPrice(price: number) {
        this.mimPrice = price;
    }

    public getMimPrice() {
        return this.mimPrice;
    }
}
