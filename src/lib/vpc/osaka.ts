import * as cdk from '@aws-cdk/core';
import * as ec2 from '@aws-cdk/aws-ec2';
import { CfnSubnet, Peer, Port, SecurityGroup } from "@aws-cdk/aws-ec2";

export class OsakaVpc extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

      // ---- VPC ----

      // ap-northeast-3
     const oskVPC = new ec2.Vpc( this, "oskVpc", {
         cidr: "10.3.0.0/16",
         defaultInstanceTenancy: ec2.DefaultInstanceTenancy.DEFAULT,
         enableDnsSupport: true,
         enableDnsHostnames: true,
         subnetConfiguration: []
     });

     const oskSubnet = new ec2.Subnet( this, "oskSubnet", {
         availabilityZone: "ap-northeast-3c",
         vpcId: oskVPC.vpcId,
         cidrBlock: "10.3.3.0/24"
     });

     const oskInternetGateway = new ec2.CfnInternetGateway( this, "oskIGW", {})
     new ec2.CfnVPCGatewayAttachment(this, "oskIGwAttach", {
         vpcId: oskVPC.vpcId,
         internetGatewayId: oskInternetGateway.ref
     });

      oskSubnet.addRoute("oskSubnetRoute", {
        routerType: ec2.RouterType.GATEWAY,
        routerId: oskInternetGateway.ref
      });

      // ---- Security Group ----

    // ap-northeast-3
      const oskSecurityGroup = new SecurityGroup(this, "oskSecurityGroup",{
        vpc: oskVPC
      });

      oskSecurityGroup.addEgressRule(ec2.Peer.anyIpv4(), ec2.Port.allTraffic());
      oskSecurityGroup.addIngressRule(ec2.Peer.anyIpv4(), ec2.Port.allUdp());

      // ---- EC2 ----

      const oskEc2Image = new ec2.AmazonLinuxImage({
        cpuType: ec2.AmazonLinuxCpuType.X86_64,
        edition: ec2.AmazonLinuxEdition.STANDARD,
        generation: ec2.AmazonLinuxGeneration.AMAZON_LINUX_2,
        storage: ec2.AmazonLinuxStorage.GENERAL_PURPOSE
    });
    const oskEc2ImageWin = new ec2.WindowsImage(ec2.WindowsVersion.WINDOWS_SERVER_2019_JAPANESE_FULL_BASE);

     const oskEc2 = new ec2.CfnInstance(this, "oskEc2", {
       instanceType: new ec2.InstanceType("t3.micro").toString(),
       imageId: oskEc2Image.getImage(this).imageId,
       networkInterfaces: [{
         associatePublicIpAddress: true,
         deviceIndex: "0",
         groupSet: [oskSecurityGroup.securityGroupId],
         subnetId: oskSubnet.subnetId
       }],
       keyName: this.node.tryGetContext('key_pair')
     });

      new cdk.CfnOutput(this, "Id", { value: oskEc2.ref});
      new cdk.CfnOutput(this, "PublicIp", { value: oskEc2.attrPublicIp });

  }
}
