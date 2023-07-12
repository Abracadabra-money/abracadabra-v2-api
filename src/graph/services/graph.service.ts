import { Injectable } from '@nestjs/common';
import { ChainId } from '../../blockchain/constants';
import { GraphGqlService } from './graph-gql.service';
import { GraphHelpersService } from './graph-helpers.service';
import { HttpService } from '@nestjs/axios';
import { Observable, map } from 'rxjs';
import { Protocol } from '../types';

@Injectable()
export class GraphService {
    constructor(private readonly graphGqlService: GraphGqlService, private readonly graphHelpersService: GraphHelpersService, private readonly httpService: HttpService) {}

    public getAbraProtocol(chain: ChainId): Observable<Protocol> {
        const query = this.graphGqlService.getProtocol();
        const url = this.graphHelpersService.getAbraGraphUrl(chain);
        return this.httpService.post(url, { query }).pipe(map(({ data }) => data?.data?.protocols[0]));
    }
}
