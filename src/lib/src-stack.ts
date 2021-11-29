import * as cdk from '@aws-cdk/core';

import { OsakaVpc } from './vpc/osaka' ;
import { TokyoVpc } from './vpc/tokyo' ;

export class SrcStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

  const app = new cdk.App();

  new OsakaVpc( app, 'OsakaVpc' );
  new TokyoVpc( app, 'TokyoVpc' );

  }
}
