const path = require('path')

const s3 = require('aws-cdk-lib/aws-s3')
const cdk = require('aws-cdk-lib')
const cloudfront = require('aws-cdk-lib/aws-cloudfront')
const cloudfront_origins = require('aws-cdk-lib/aws-cloudfront-origins')
const acm = require('aws-cdk-lib/aws-certificatemanager')
const targets = require('aws-cdk-lib/aws-route53-targets')
const codePipelineActions = require('aws-cdk-lib/aws-codepipeline-actions')
const codePipeline = require('aws-cdk-lib/aws-codepipeline')
const route53 = require('aws-cdk-lib/aws-route53')
const apigateway = require('aws-cdk-lib/aws-apigateway')
const iam = require('aws-cdk-lib/aws-iam')
const codebuild = require('aws-cdk-lib/aws-codebuild')
const dynamoDB = require('aws-cdk-lib/aws-dynamodb')
const lambda = require('aws-cdk-lib/aws-lambda')
const cognito = require('aws-cdk-lib/aws-cognito')
//const acm = require('@aws-cdk-lib/aws-certificatemanager')

const environVars = require('../env.json')
const { HOSTED_ZONE_NAME, REPO_OWNER, REPO_NAME, REPO_ACCESS_TOKEN, APPLICATION_NAME, DYNAMO_TABLE, DYNAMO_GSI, ACMARN, BASE_API } = environVars // TODO Move these to secrets
const { Stack, Duration, SecretValue } = require('aws-cdk-lib');

class ClientCdkStack extends Stack {
  /**
   *
   * @param {Construct} scope
   * @param {string} id
   * @param {StackProps=} props
   */
  constructor(scope, id, props) {
    super(scope, id, props);

    // dynamodb
    const dynamoTable = new dynamoDB.Table(this, 'Table', {
      partitionKey: { name: 'pk', type: dynamoDB.AttributeType.STRING},
      sortKey: { name: 'sk', type: dynamoDB.AttributeType.STRING},
      tableName: DYNAMO_TABLE,
      removalPolicy: cdk.RemovalPolicy.DESTROY, // will be removed in prod
    })

    dynamoTable.addGlobalSecondaryIndex({
      indexName: `${DYNAMO_GSI}Index`,
      partitionKey: { name: 'sk', type: dynamoDB.AttributeType.STRING},
      sortKey: { name: DYNAMO_GSI, type: dynamoDB.AttributeType.STRING},
      readCapacity: 1,
      writeCapacity: 1,
      projectionType: dynamoDB.ProjectionType.ALL
    })

    // lambdas
    const getHighScore = new lambda.Function(this, 'getHighScores', {
      runtime: lambda.Runtime.PYTHON_3_8,
      description: 'Fetches the highscore',
      handler: 'get_high_score.handler',
      code: lambda.Code.fromAsset(path.join(__dirname, 'lambdas/')),
      environment:{
        TABLE: dynamoTable.tableName,
        TABLE_INDEX: `${DYNAMO_GSI}Index`
      }
    })

    getHighScore.addToRolePolicy(
      new iam.PolicyStatement({
        effect: iam.Effect.ALLOW,
        actions: ['dynamodb:*'], 
        resources: [dynamoTable.tableArn,`${dynamoTable.tableArn}/index/*`]
      })
    )

    const setHighScore = new lambda.Function(this, 'setHighScores', {
      runtime: lambda.Runtime.PYTHON_3_8,
      description: 'Sets the highscore',
      handler: 'set_high_score.handler',
      code: lambda.Code.fromAsset(path.join(__dirname, 'lambdas/')),
      environment:{
        TABLE: dynamoTable.tableName,
        TABLE_INDEX: `${DYNAMO_GSI}Index`
      }
    })

    // TODO create policy to attach to set/get highscore
    setHighScore.addToRolePolicy(
      new iam.PolicyStatement({
        effect: iam.Effect.ALLOW,
        actions: ['dynamodb:*'],
        resources: [dynamoTable.tableArn, `${dynamoTable.tableArn}/index/*`]
      })
    )

    // post confirmation signup lambda
    const postConfirmationSignup = new lambda.Function(this, 'postConfirmationSignup', {
      runtime: lambda.Runtime.PYTHON_3_8,
      handler: 'post_confirmation_signup.handler',
      code: lambda.Code.fromAsset(path.join(__dirname, 'lambdas/')),
      environment:{
        USER_TABLE: dynamoTable.tableName
      }
    });

    postConfirmationSignup.addToRolePolicy(
      new iam.PolicyStatement({
        effect: iam.Effect.ALLOW,
        actions: ['dynamodb:*'],
        resources: ['*'], // TODO this should be better defined
      })
    )
  
    // cognito custom message lambda trigger
    const cognitoCustomMessage = new lambda.Function(this, 'cognitoCustomMessage', {
      runtime: lambda.Runtime.PYTHON_3_8,
      handler: 'cognito_custom_message_function.handler',
      code: lambda.Code.fromAsset(path.join(__dirname, 'lambdas/')),
      environment:{
        BASE_API
      }
    })

    // Cognito
    const userPool = new cognito.UserPool(this, `${APPLICATION_NAME}Userpool`, {
      userPoolName: `${APPLICATION_NAME}Userpool`,
      selfSignUpEnabled: true, 
      userVerification: {
        emailSubject: `${HOSTED_ZONE_NAME} Support`,
        emailStyle: cognito.VerificationEmailStyle.CODE,
        emailBody: 'Hi {username}, please verify your email by clicking this link {####}'
      },
      signInAliases: {
        email: true
      },
      signInCaseSensitive: false,
      accountRecovery: cognito.AccountRecovery.EMAIL_ONLY,
      lambdaTriggers: {
        postConfirmation: postConfirmationSignup,
        customMessage: cognitoCustomMessage
      },
      passwordPolicy: {
        minLength: 8,
        requireDigits: true, 
        requireLowercase: false,
        requireSymbols: false,
        requireUppercase: false
      },
      removalPolicy: cdk.RemovalPolicy.DESTROY
    })
  
    const fromEmailAddress = `noreply@${HOSTED_ZONE_NAME}`

    const cfnUserPool = userPool.node.defaultChild

    cfnUserPool.emailConfiguration = {
      emailSendingAccount: 'DEVELOPER',
      from: `${fromEmailAddress}`,
      sourceArn: `arn:aws:ses:eu-west-1:${this.account}:identity/${HOSTED_ZONE_NAME}`, // SES integration is only available in us-east-1, us-west-2, eu-west-1
    };

    const poolClient = userPool.addClient(`${APPLICATION_NAME}-app-client`, {
      accessTokenValidity: cdk.Duration.minutes(600),
      idTokenValidity: cdk.Duration.minutes(600),
      preventUserExistenceErrors: true,
      generateSecret: false,
      authFlows: {
        userPassword: true
      },
      disableOAuth: true,
    })

    const certification = acm.Certificate.fromCertificateArn(this, 'Certificate', ACMARN);
 
    userPool.addDomain('Domain', {
      customDomain: {
        certificate: certification,
        domainName:`auth.${HOSTED_ZONE_NAME}`
      },
    })
  
  // auth lambdas
  // getUserDetailsLambda
  const getUserDetailsLambda = new lambda.Function(this, 'getUserDetailsLambda', {
    runtime: lambda.Runtime.PYTHON_3_8,
    description: 'Handles user authentication from the web client',
    handler: 'get_user_details_function.handler',
    code: lambda.Code.fromAsset(path.join(__dirname, 'lambdas/')),
    environment:{
      COGNITO_APP_CLIENT_ID: poolClient.userPoolClientId,
      USER_TABLE: dynamoTable.tableName
    }
  })

  getUserDetailsLambda.addToRolePolicy(
    new iam.PolicyStatement({
      effect: iam.Effect.ALLOW,
      actions: ['cognito:*'],
      resources: ['*'], // TODO this should be better defined
    })
  )
  getUserDetailsLambda.addToRolePolicy(
    new iam.PolicyStatement({
      effect: iam.Effect.ALLOW,
      actions: ['dynamodb:*'],
      resources: ['*'], // TODO this should be better defined
    })
  )

  // signin lambda
  const signInLambda = new lambda.Function(this, 'signInFunction', {
    runtime: lambda.Runtime.PYTHON_3_8,
    handler: 'signin_function.handler',
    description: 'Handles user sign in from the web client',
    code: lambda.Code.fromAsset(path.join(__dirname, 'lambdas/')),
    environment:{
      COGNITO_USER_POOL_ID: userPool.userPoolId,
      COGNITO_APP_CLIENT_ID: poolClient.userPoolClientId,
      USER_TABLE: dynamoTable.tableName
    }
  })

  signInLambda.addToRolePolicy(
    new iam.PolicyStatement({
      effect: iam.Effect.ALLOW,
      actions: ['cognito:*'],
      resources: ['*'], // TODO this should be better defined
    })
  )
  signInLambda.addToRolePolicy(
    new iam.PolicyStatement({
      effect: iam.Effect.ALLOW,
      actions: ['dynamodb:*'],
      resources: ['*'], // TODO this should be better defined
    })
  )

  // signup lambda
  const signUpLambda = new lambda.Function(this, 'signUpFunction', {
    runtime: lambda.Runtime.PYTHON_3_8,
    handler: 'signup_function.handler',
    description: 'Handles user signup from web client',
    code: lambda.Code.fromAsset(path.join(__dirname, 'lambdas/')),
    environment:{
      COGNITO_USER_POOL_ID: userPool.userPoolId,
      COGNITO_APP_CLIENT_ID: poolClient.userPoolClientId
    }
  })

  signUpLambda.addToRolePolicy(
    new iam.PolicyStatement({
      effect: iam.Effect.ALLOW,
      actions: ['cognito:*'],
      resources: ['*'], // TODO this should be better defined
    })
  )

  const signUpAuthLambda = new lambda.Function(this, 'signUpAuthLambda', {
    runtime: lambda.Runtime.PYTHON_3_8,
    handler: 'signup_auth_lambda.handler',
    code: lambda.Code.fromAsset(path.join(__dirname, 'lambdas/')),
    environment:{
      DOMAIN: HOSTED_ZONE_NAME,
    }
  });

  signUpAuthLambda.addToRolePolicy(
    new iam.PolicyStatement({
      effect: iam.Effect.ALLOW,
      actions: ['cognito:*'],
      resources: ['*'], // TODO this should be better defined
    })
  )

  // password reset lambda
  const passwordResetLambda = new lambda.Function(this, 'passwordResetFunction', {
    runtime: lambda.Runtime.PYTHON_3_8,
    handler: 'password_reset.handler',
    description: 'Handles password reset request from client',
    code: lambda.Code.fromAsset(path.join(__dirname, 'lambdas/')),
    environment:{
      COGNITO_APP_CLIENT_ID: poolClient.userPoolClientId
    }
  })

  passwordResetLambda.addToRolePolicy(
    new iam.PolicyStatement({
      effect: iam.Effect.ALLOW,
      actions: ['cognito:*'],
      resources: ['*'], // TODO this should be better defined
    })
  )

  // password reset confirm lambda
  const passwordResetConfirmLambda = new lambda.Function(this, 'passwordResetConfirmLambda', {
    runtime: lambda.Runtime.PYTHON_3_8,
    handler: 'password_reset_confirm.handler',
    description: 'Handles finalizing of password reset',
    code: lambda.Code.fromAsset(path.join(__dirname, 'lambdas/')),
    environment:{
      COGNITO_APP_CLIENT_ID: poolClient.userPoolClientId
    }
  })

  passwordResetConfirmLambda.addToRolePolicy(
    new iam.PolicyStatement({
      effect: iam.Effect.ALLOW,
      actions: ['cognito:*'],
      resources: ['*'],         
      actions: ['dynamodb:*'], // TODO this should be better defined
    })
  )


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
    const sourceOutput = new codePipeline.Artifact()
    const outputWebsite = new codePipeline.Artifact()

    const sourceAction = new codePipelineActions.GitHubSourceAction({
      actionName: 'Get_Source',
      owner: REPO_OWNER,
      repo: REPO_NAME,
      oauthToken: SecretValue.plainText(REPO_ACCESS_TOKEN),
      output: sourceOutput,
      branch: 'master'
    })

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
            'npm run build'
          ]
        }
      },
      artifacts: {
        'base-directory': 'client/public',
        files: ['**/*']
      }
    }

    const pipelineProject = new codebuild.PipelineProject(this, 'pipelineProject', {
      projectName: 'client_build_project',
      buildSpec: codebuild.BuildSpec.fromObject(buildStep)
    })

    const buildAction = new codePipelineActions.CodeBuildAction({
      actionName: 'Build_client',
      project: pipelineProject,
      input: sourceOutput,
      outputs: [outputWebsite]
    })

    const deployAction = new codePipelineActions.S3DeployAction({
      actionName: 'Deploy_client',
      input: outputWebsite,
      bucket: websiteBucket
    })

    const pipeline = new codePipeline.Pipeline(this, 'Pipeline', {
      pipelineName: `Pipeline-${APPLICATION_NAME}`
    })
    
    pipeline.addStage({
      stageName: 'Source',
      actions: [sourceAction]
    })

    pipeline.addStage({
      stageName: 'Build',
      actions: [buildAction]
    })

    pipeline.addStage({
      stageName: 'Deploy',
      actions: [deployAction]
    })

    pipeline.addToRolePolicy(
      new iam.PolicyStatement({
        effect: iam.Effect.ALLOW,
        actions: [ 
          's3:*'
        ],
        resources:  [`arn:aws:s3:::${HOSTED_ZONE_NAME}`, `arn:aws:s3:::${HOSTED_ZONE_NAME}/*`]
      })
    )

    // api
    console.log(certificate)
    const api = new apigateway.RestApi(this, `${APPLICATION_NAME}Api`, {
      proxy: false,
      domainName: {
        domainName: `api.${HOSTED_ZONE_NAME}`,
        certificate: {
          certificateArn: certificate.certificateArn
        },
        endpointType: apigateway.EndpointType.EDGE
      }
    })

    // TODO make endopints lowercase only
    const fetchHighscoreEndpoint = api.root.addResource('fetchHighscoreEndpoint')
    fetchHighscoreEndpoint.addMethod('GET', new apigateway.LambdaIntegration(getHighScore, { proxy:true}))
    fetchHighscoreEndpoint.addCorsPreflight({
      allowOrigins: apigateway.Cors.ALL_ORIGINS
    })

    const setHighscoreEndpoint = api.root.addResource('setHighscoreEndpoint')
    setHighscoreEndpoint.addMethod('POST', new apigateway.LambdaIntegration(setHighScore, { proxy:true}))
    setHighscoreEndpoint.addCorsPreflight({
      allowOrigins: apigateway.Cors.ALL_ORIGINS
    })

    const signin = api.root.addResource('signin')
    signin.addMethod('POST', new apigateway.LambdaIntegration(signInLambda, { proxy:true}))
    signin.addCorsPreflight({
      allowOrigins: apigateway.Cors.ALL_ORIGINS
    })

    const getUserDetails = api.root.addResource('getuserdetails')
    getUserDetails.addMethod('POST', new apigateway.LambdaIntegration(getUserDetailsLambda, { proxy:true}))
    getUserDetails.addCorsPreflight({
      allowOrigins: apigateway.Cors.ALL_ORIGINS
    })
    const signup = api.root.addResource('signup')
    signup.addMethod('POST', new apigateway.LambdaIntegration(signUpLambda, { proxy:true}))
    signup.addCorsPreflight({
      allowOrigins: apigateway.Cors.ALL_ORIGINS
    })

    const signupauth = api.root.addResource('signupauth')
    signupauth.addMethod('GET', new apigateway.LambdaIntegration(signUpAuthLambda, { proxy:true}))

    const passwordReset = api.root.addResource('passwordreset')
    passwordReset.addMethod('POST', new apigateway.LambdaIntegration(passwordResetLambda, { proxy:true}))
    passwordReset.addCorsPreflight({
      allowOrigins: apigateway.Cors.ALL_ORIGINS
    })

    const passwordResetConfirm = api.root.addResource('passwordresetconfirm')
    passwordResetConfirm.addMethod('GET', new apigateway.LambdaIntegration(passwordResetConfirmLambda, { proxy:true}))
    passwordResetConfirm.addCorsPreflight({
      allowOrigins: apigateway.Cors.ALL_ORIGINS
    })

    const routeA = new route53.ARecord(this, 'ARecord', {
      recordName: `api.${HOSTED_ZONE_NAME}`,
      zone,
      zoneName: `${HOSTED_ZONE_NAME}`,
      target: route53.RecordTarget.fromAlias(new targets.ApiGateway(api)),
      comment: 'Custom domain name'
    });
    routeA.applyRemovalPolicy(cdk.RemovalPolicy.DESTROY)
  }
}

module.exports = { ClientCdkStack }
