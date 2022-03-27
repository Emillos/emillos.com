const path = require('path')

const s3 = require('aws-cdk-lib/aws-s3')
const cdk = require('aws-cdk-lib')
const cloudfront = require('aws-cdk-lib/aws-cloudfront')
const cloudfront_origins = require('aws-cdk-lib/aws-cloudfront-origins')
const acm = require('aws-cdk-lib/aws-certificatemanager')
const targets = require('aws-cdk-lib/aws-route53-targets')
const pipelines = require('aws-cdk-lib/pipelines')
const route53 = require('aws-cdk-lib/aws-route53')
const iam = require('aws-cdk-lib/aws-iam')
const codebuild = require('aws-cdk-lib/aws-codebuild')

const environVars = require('../env.json')
const { HOSTED_ZONE_NAME, CODESTAR_ARN } = environVars
const { Stack, Duration } = require('aws-cdk-lib');
const { CodeStarConnectionsSourceAction } = require('aws-cdk-lib/aws-codepipeline-actions')
const { Pipeline } = require('aws-cdk-lib/aws-codepipeline')

class ClientCdkStack extends Stack {
  /**
   *
   * @param {Construct} scope
   * @param {string} id
   * @param {StackProps=} props
   */
  constructor(scope, id, props) {
    super(scope, id, props);

    // S3 configuations
    const websiteBucket = new s3.Bucket(this, 'websiteBucket', {
      bucketName: HOSTED_ZONE_NAME,
      blockPublicAccess: new s3.BlockPublicAccess({ blockPublicPolicy: false }),
      publicReadAccess: true,
      isWebsite: true,
      removalPolicy: cdk.RemovalPolicy.DESTROY, // will be removed in prod
      autoDeleteObjects: true, // will be removed in prod
    })

    // Get Hosted Zone
    const zone = route53.HostedZone.fromLookup(this, 'Zone', {
      domainName: HOSTED_ZONE_NAME
    });

    // Create Certificate
    const certificate = new acm.DnsValidatedCertificate(this, 'SiteCertificate', {
      domainName: HOSTED_ZONE_NAME,
      hostedZone: zone,
      subjectAlternativeNames: [`www.${HOSTED_ZONE_NAME}`, `*.${HOSTED_ZONE_NAME}`],
      region: 'us-east-1',
      cleanupRoute53Records: true
    });

    const cloudfrontOAI = new cloudfront.OriginAccessIdentity(this, 'cloudfront-OAI', {
      comment: `OAI for CDN`
    });

    // Create Cname for www domain
    const cname = new route53.CnameRecord(this, 'Cname', {
      domainName: `${HOSTED_ZONE_NAME}`,
      zone: zone,
      comment: 'Cname for www',
      recordName: `www.${HOSTED_ZONE_NAME}`,
    });

    // Cloudfront distribution
    const CDN = new cloudfront.Distribution(this, 'CDN', {
      certificate: certificate,
      priceClass: 'PriceClass_100',
      defaultRootObject: 'index.html',
      domainNames: [HOSTED_ZONE_NAME, `www.${HOSTED_ZONE_NAME}`],
      errorResponses:[
        {
          httpStatus: 403,
          responseHttpStatus: 403,
          responsePagePath: '/index.html',
        }
      ],
      defaultBehavior: {
        origin: new cloudfront_origins.S3Origin(websiteBucket, {originAccessIdentity: cloudfrontOAI}),
        compress: true,
        allowedMethods: cloudfront.AllowedMethods.ALLOW_GET_HEAD_OPTIONS,
        viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
      }
   });

    // Redirect hits to the cloudfront distrubution
    new route53.ARecord(this, 'CDNAliasRecord', {
      recordName: `${HOSTED_ZONE_NAME}`,
      target: route53.RecordTarget.fromAlias(new targets.CloudFrontTarget(CDN)),
      zone
    });

    // Pipeline
    // https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.aws_codebuild-readme.html#codepipeline

    const sourceBuildStep = {      
      owner: 'Emillos',
      repo: 'emillos.com',
    }
    const buildStep = {
      version: '0.2',
      phases: {
        install: {
          commands: [
            'cd client/',
            'echo installing dependencies',
            'npm install'
          ]
        },
        build:{
          commands:[
            'echo Building app',
            'npm run build',
            `echo Copy build to s3://${HOSTED_ZONE_NAME}`,
            'ls',
            'ls ./public',
            `aws s3 cp --recursive ./public s3://${HOSTED_ZONE_NAME}/`
          ]
        }
      }
    }

    const codeBuildLine = new codebuild.Project(this, 'emillos.com-buildline', {
      source: codebuild.Source.gitHub(sourceBuildStep),
      buildSpec: codebuild.BuildSpec.fromObject(buildStep),
    })
    
    codeBuildLine.addToRolePolicy(
      new iam.PolicyStatement({
        effect: iam.Effect.ALLOW,
        actions: [ 
          's3:*'
        ],
        resources:  [`arn:aws:s3:::${HOSTED_ZONE_NAME}`, `arn:aws:s3:::${HOSTED_ZONE_NAME}/*`]
      })
    )
  }
}

module.exports = { ClientCdkStack }
