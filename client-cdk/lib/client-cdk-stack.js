const ec2 = require('aws-cdk-lib/aws-ec2')
const cdk = require('aws-cdk-lib')
const iam = require('aws-cdk-lib/aws-iam')
const elasticbeanstalk = require('aws-cdk-lib/aws-elasticbeanstalk')
const route53Targets = require('aws-cdk-lib/aws-route53-targets')
const route53 = require('aws-cdk-lib/aws-route53')

const environVars = require('../env.json')
const { APPLICATION_NAME, HOSTED_ZONE_NAME, EB_ENVIRONMENT_URL } = environVars
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

    const applicationName = `${APPLICATION_NAME}-application`

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
          name: `${APPLICATION_NAME}-private-subnet`,
          subnetType: ec2.SubnetType.PRIVATE_ISOLATED,
          cidrMask: 24 
        }
      ]
    });

    // Security group
    const applicationSG = new ec2.SecurityGroup(this, `${applicationName}-sg`, {
      vpc,
      allowAllOutbound: false,
      description: `application SG for ${APPLICATION_NAME}`
    })
    applicationSG.addEgressRule(
      ec2.Peer.anyIpv4(),
      ec2.Port.tcpRange(3000, 4000),
      'allow outgroing traffic from between port 3000 and 4000'
    )

    // Elastic beanstalk setup 
    const ebApplication = new elasticbeanstalk.CfnApplication(this, `${APPLICATION_NAME}-eb-application`, {
      applicationName,
      description: `Application for ${APPLICATION_NAME}`,      
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

    // fetch Hosted zone Id
    const zone = route53.HostedZone.fromLookup(this, 'hostedZone', {
      domainName: HOSTED_ZONE_NAME,
    });

    /*
      For now its not possible to create a record in route54 and point it towards the EB in one go.
      read https://github.com/aws/aws-cdk/issues/17992 for more details

      Instead we'll have to run the cdk twice.
      Once to build the stask.
      And once again once we've added the Beanstalk environment url to the .env.
    */

    if(EB_ENVIRONMENT_URL){
      const domainRouting = new route53.ARecord(this, 'AliasRecord', {
        zone,
        target: route53.RecordTarget.fromAlias(new route53Targets.ElasticBeanstalkEnvironmentEndpointTarget(EB_ENVIRONMENT_URL)),
      });
    }
  }
}

module.exports = { ClientCdkStack }
