const ec2 = require('aws-cdk-lib/aws-ec2')
const cdk = require('aws-cdk-lib')
const iam = require('aws-cdk-lib/aws-iam')
const elasticbeanstalk = require('aws-cdk-lib/aws-elasticbeanstalk')

const { Stack, Duration } = require('aws-cdk-lib');

class ClientCdkStack extends Stack {
  /**
   *
   * @param {Construct} scope
   * @param {string} id
   * @param {StackProps=} props
   */
  constructor(scope, id, props) {
    super(scope, id, props);

    const applicationName = 'emillos-application'

    // roles
    const EbInstanceRole = new iam.Role(this, `${applicationName}-aws-elasticbeanstalk-ec2-role`, {
      assumedBy: new iam.ServicePrincipal('ec2.amazonaws.com'),
    });
    
    const managedPolicy = iam.ManagedPolicy.fromAwsManagedPolicyName('AWSElasticBeanstalkWebTier')
    EbInstanceRole.addManagedPolicy(managedPolicy);
    
    const profileName = `${applicationName}-InstanceProfile`
    const instanceProfile = new iam.CfnInstanceProfile(this, profileName, {
      instanceProfileName: profileName,
      roles: [
        EbInstanceRole.roleName
      ]
    });

    // VPC
    const vpc = new ec2.Vpc(this, 'VPC', {
      cidr: '10.0.0.0/16',
      natGateways: 0,
      maxAzs: 3,
      subnetConfiguration: [
        {
          name: 'emillos-private-subnet',
          subnetType: ec2.SubnetType.PRIVATE_ISOLATED,
          cidrMask: 24 
        }
      ]
    });

    // Security group
    const applicationSG = new ec2.SecurityGroup(this, 'application-sg', {
      vpc,
      allowAllOutbound: false,
      description: 'application SG for Emillos.com'
    })
    applicationSG.addEgressRule(
      ec2.Peer.anyIpv4(),
      ec2.Port.tcpRange(3000, 4000),
      'allow outgroing traffic from between port 3000 and 4000'
    )

    // Elastic beanstalk setup 
    const ebApplication = new elasticbeanstalk.CfnApplication(this, 'emillos-eb-application', {
      applicationName,
      description: 'Application for Emillos.com',      
    })

    let optionSettingProperties = [elasticbeanstalk.CfnEnvironment.OptionSettingProperty =
      {
        namespace: 'aws:autoscaling:launchconfiguration',
        optionName: 'InstanceType',
        value: 't2.micro'
        },
        {
          namespace: 'aws:autoscaling:launchconfiguration',
          optionName: 'IamInstanceProfile',
          value: profileName
        } 
    ]
    const applicationEnvironment = new elasticbeanstalk.CfnEnvironment(this, 'Environment', {
      environmentName: 'applicationEnvionment',
      applicationName: ebApplication.applicationName,
      solutionStackName: '64bit Amazon Linux 2 v3.4.11 running Docker',
      optionSettings: optionSettingProperties
    })
    applicationEnvironment.addDependsOn(ebApplication);
  }
}

module.exports = { ClientCdkStack }
