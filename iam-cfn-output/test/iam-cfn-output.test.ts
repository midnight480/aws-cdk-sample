import { expect as expectCDK, matchTemplate, MatchStyle } from '@aws-cdk/assert';
import * as cdk from '@aws-cdk/core';
import * as IamCfnOutput from '../lib/iam-cfn-output-stack';

test('Empty Stack', () => {
    const app = new cdk.App();
    // WHEN
    const stack = new IamCfnOutput.IamCfnOutputStack(app, 'MyTestStack');
    // THEN
    expectCDK(stack).to(matchTemplate({
      "Resources": {}
    }, MatchStyle.EXACT))
});
