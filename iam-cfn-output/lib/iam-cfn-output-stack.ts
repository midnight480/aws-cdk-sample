import * as cdk from '@aws-cdk/core';
import * as iam from '@aws-cdk/aws-iam';

const awsAccountId = cdk.Aws.ACCOUNT_ID ;

// iam resouce settings
const testAdminGroupName = "testAdminGroup" ;
const testAdminUser = "testAdminUser" ;
const testAdminPassword = "#W0rdP@ss123!" ;
const testMFADeviceName = "testMFA" ;
const testMFAUsers = [testAdminUser] ;
const ipAddressPolicyName = "allowAccessViaTargetIpAddress"
const ipAddress = '1.1.1.1/32' ; // e.g.
//const ipAddressList = [ "1.1.1.1/32","2.2.2.2/32" ] ; // e.g.

export class IamCfnOutputStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Custom Policy Statement
    const ipAddressPolicyStatement = new iam.PolicyStatement(
      {
          effect: iam.Effect.DENY ,
          resources: ["*"] ,
          actions: ["*" ] ,
          conditions: {
              'NotIpAddress': {
                  'aws:SourceIp': [
                    ipAddress
                  ]
              }
          }
      } 
    );

    // Custome Policy
    const ipAddressPolicy = new iam.Policy(
      this,
      ipAddressPolicyName,
      {
        policyName: `allowAccessViaTargetIpAddress` ,
        statements: [ipAddressPolicyStatement],
      }
    );

    // Managed Policy
    const powerUserAccessPolicy = iam.ManagedPolicy.fromAwsManagedPolicyName('PowerUserAccess') ;

    // Custom Group
    const testAdminGroup = new iam.Group(
      this,
      testAdminGroupName,
      {
        groupName: testAdminGroupName
      }
    );

    // Attach Policy to Group
    testAdminGroup.addManagedPolicy(powerUserAccessPolicy);
    testAdminGroup.attachInlinePolicy(ipAddressPolicy);

      const testAdmin = new iam.User(
        this,
        testAdminUser,
        {
          userName: testAdminUser,
          password: cdk.SecretValue.plainText(testAdminPassword),
          groups: [testAdminGroup]
        }
      )

      const mfaDevice = new iam.CfnVirtualMFADevice(
        this,
        testMFADeviceName,
        {
          users: testMFAUsers,
          virtualMfaDeviceName: testMFADeviceName
        }
      )

      new cdk.CfnOutput(this, "MFA-SerialNumber", { value: mfaDevice.attrSerialNumber});

  }
}
