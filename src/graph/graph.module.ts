import { Global, Module } from '@nestjs/common';
import { GraphService } from './services/graph.service';
import { GraphGqlService } from './services/graph-gql.service';
import { GraphHelpersService } from './services/graph-helpers.service';
import { HttpModule } from '@nestjs/axios';

@Global()
@Module({
    imports: [HttpModule],
    providers: [GraphService, GraphHelpersService, GraphGqlService],
    exports: [GraphService],
})
export class GraphModule {}
