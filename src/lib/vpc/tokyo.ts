import * as cdk from '@aws-cdk/core';
import * as ec2 from '@aws-cdk/aws-ec2';
import { CfnSubnet, Peer, Port, SecurityGroup } from "@aws-cdk/aws-ec2";

export class TokyoVpc extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

      // ---- VPC ----
        // ap-northeast-1
        const tkyVPC = new ec2.Vpc( this, "tkyVpc", {
          cidr: "10.1.0.0/16",
          defaultInstanceTenancy: ec2.DefaultInstanceTenancy.DEFAULT,
          enableDnsSupport: true,
          enableDnsHostnames: true,
          subnetConfiguration: []
      });

      const tkySubnet = new ec2.Subnet( this, "tkySubnet", {
          availabilityZone: "ap-northeast-1a",
          vpcId: tkyVPC.vpcId,
          cidrBlock: "10.1.1.0/24",
      });

      const tkyInternetGateway = new ec2.CfnInternetGateway( this, "tkyIGW", {})
      new ec2.CfnVPCGatewayAttachment(this, "tkyIGwAttach", {
          vpcId: tkyVPC.vpcId,
          internetGatewayId: tkyInternetGateway.ref
      });

      tkySubnet.addRoute("tkySubnetRoute", {
        routerType: ec2.RouterType.GATEWAY,
        routerId: tkyInternetGateway.ref
      });

    // ---- Security Group ----

      // ap-northeast-1
     const tkySecurityGroup = new SecurityGroup(this, "tkySecurityGroup",{
        vpc: tkyVPC
      });
 
      tkySecurityGroup.addEgressRule(ec2.Peer.anyIpv4(), ec2.Port.allTraffic());
      tkySecurityGroup.addIngressRule(ec2.Peer.anyIpv4(), ec2.Port.allIcmp());
      tkySecurityGroup.addIngressRule(ec2.Peer.anyIpv4(), ec2.Port.tcp(22));
      tkySecurityGroup.addIngressRule(ec2.Peer.anyIpv4(), ec2.Port.tcp(3389));
 
      // ---- EC2 ----

      const tkyEc2Image = new ec2.AmazonLinuxImage({
                                              cpuType: ec2.AmazonLinuxCpuType.X86_64,
                                              edition: ec2.AmazonLinuxEdition.STANDARD,
                                              generation: ec2.AmazonLinuxGeneration.AMAZON_LINUX_2,
                                              storage: ec2.AmazonLinuxStorage.GENERAL_PURPOSE
                                   });
      const tkyEc2ImageWin = new ec2.WindowsImage(ec2.WindowsVersion.WINDOWS_SERVER_2019_JAPANESE_FULL_BASE);

    const tkyEc2a = new ec2.CfnInstance(this, "tkyEc2a", {
    instanceType: new ec2.InstanceType("t3.micro").toString(),
    imageId: tkyEc2Image.getImage(this).imageId,
    networkInterfaces: [{
    associatePublicIpAddress: true,
    deviceIndex: "0",
    groupSet: [tkySecurityGroup.securityGroupId],
    subnetId: tkySubnet.subnetId
    }],
    keyName: this.node.tryGetContext('key_pair')
    });

    const tkyEc2b = new ec2.CfnInstance(this, "tkyEc2b", {
    instanceType: new ec2.InstanceType("t3.micro").toString(),
    imageId: tkyEc2Image.getImage(this).imageId,
    networkInterfaces: [{
    associatePublicIpAddress: true,
    deviceIndex: "0",
    groupSet: [tkySecurityGroup.securityGroupId],
    subnetId: tkySubnet.subnetId
    }],
    keyName: this.node.tryGetContext('key_pair')
    });

    const tkyEc2c = new ec2.CfnInstance(this, "tkyEc2c", {
    instanceType: new ec2.InstanceType("t3.micro").toString(),
    imageId: tkyEc2Image.getImage(this).imageId,
    networkInterfaces: [{
    associatePublicIpAddress: true,
    deviceIndex: "0",
    groupSet: [tkySecurityGroup.securityGroupId],
    subnetId: tkySubnet.subnetId
    }],
    keyName: this.node.tryGetContext('key_pair')
    });

    const tkyEc2d = new ec2.CfnInstance(this, "tkyEc2d", {
    instanceType: new ec2.InstanceType("t3.micro").toString(),
    imageId: tkyEc2Image.getImage(this).imageId,
    networkInterfaces: [{
    associatePublicIpAddress: true,
    deviceIndex: "0",
    groupSet: [tkySecurityGroup.securityGroupId],
    subnetId: tkySubnet.subnetId
    }],
    keyName: this.node.tryGetContext('key_pair')
    });

    const tkyEc2e = new ec2.CfnInstance(this, "tkyEc2e", {
    instanceType: new ec2.InstanceType("t3.micro").toString(),
    imageId: tkyEc2ImageWin.getImage(this).imageId,
    networkInterfaces: [{
    associatePublicIpAddress: true,
    deviceIndex: "0",
    groupSet: [tkySecurityGroup.securityGroupId],
    subnetId: tkySubnet.subnetId
    }],
    keyName: this.node.tryGetContext('key_pair')
    });

    const tkyEc2f = new ec2.CfnInstance(this, "tkyEc2f", {
    instanceType: new ec2.InstanceType("t3.micro").toString(),
    imageId: tkyEc2ImageWin.getImage(this).imageId,
    networkInterfaces: [{
    associatePublicIpAddress: true,
    deviceIndex: "0",
    groupSet: [tkySecurityGroup.securityGroupId],
    subnetId: tkySubnet.subnetId
    }],
    keyName: this.node.tryGetContext('key_pair')
    });

    new cdk.CfnOutput(this, "Ida", { value: tkyEc2a.ref});
    new cdk.CfnOutput(this, "PublicIpa", { value: tkyEc2a.attrPublicIp });

    new cdk.CfnOutput(this, "Idb", { value: tkyEc2b.ref});
    new cdk.CfnOutput(this, "PublicIpb", { value: tkyEc2b.attrPublicIp });
  
    new cdk.CfnOutput(this, "Idc", { value: tkyEc2c.ref});
    new cdk.CfnOutput(this, "PublicIpc", { value: tkyEc2c.attrPublicIp });

    new cdk.CfnOutput(this, "Idd", { value: tkyEc2d.ref});
    new cdk.CfnOutput(this, "PublicIpd", { value: tkyEc2d.attrPublicIp });

    new cdk.CfnOutput(this, "Ide", { value: tkyEc2e.ref});
    new cdk.CfnOutput(this, "PublicIpe", { value: tkyEc2e.attrPublicIp });

    new cdk.CfnOutput(this, "Idf", { value: tkyEc2f.ref});
    new cdk.CfnOutput(this, "PublicIpf", { value: tkyEc2f.attrPublicIp });

    }
}