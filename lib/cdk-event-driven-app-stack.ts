import { Stack, StackProps, CfnOutput } from 'aws-cdk-lib';
import { NodejsFunction} from "aws-cdk-lib/aws-lambda-nodejs";

import { Construct } from 'constructs';
import { RestApi, LambdaIntegration, MethodLoggingLevel } from 'aws-cdk-lib/aws-apigateway';
import { Runtime, Tracing } from 'aws-cdk-lib/aws-lambda';
import { RetentionDays } from 'aws-cdk-lib/aws-logs';

export class CdkEventDrivenAppStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const esBuildSettings = {
      sourceMap: true,
      minify: true
    }

    const envVariables = {
      AWS_ACCOUNT_ID: Stack.of(this).account,
  };

    const functionSettings = {
      handler: "index.handler",
      runtime: Runtime.NODEJS_20_X,
      memorySize: 256,
      environment: {
        ...envVariables
      },
      logRetention: RetentionDays.ONE_WEEK,
      tracing: Tracing.ACTIVE,
      bundling: esBuildSettings
    }

    // Define a new Lambda function
    const healthLambda = new NodejsFunction(this, 'HealthHandler', {
      ...functionSettings,
      entry: 'src/health/index.ts',
      
    });

    // Define a new API Gateway REST API resource
    const api = new RestApi(this, 'Platform-X-API', {
      restApiName: 'API Gateway for the Platform X',
      description: 'This service provides backend APIs for Platform X',
    });

    // Define a new GET method for the /health resource
    const getHealthIntegration = new LambdaIntegration(healthLambda);
    api.root.addResource('health').addMethod('GET', getHealthIntegration);

    new CfnOutput(this, 'ApiUrl', {
      value: `${api.url}health` 
    })
  }
}
