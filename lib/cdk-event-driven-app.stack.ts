/* eslint-disable no-duplicate-imports */
import type { StackProps } from "aws-cdk-lib";
import { Stack } from "aws-cdk-lib";

import type { Construct } from "constructs";
import { RestApi } from "aws-cdk-lib/aws-apigateway";
import { Runtime, Tracing } from "aws-cdk-lib/aws-lambda";
import { RetentionDays } from "aws-cdk-lib/aws-logs";
import { HealthStack } from "../src/health/health.stack";
import { CfnOutput } from "aws-cdk-lib";

export class CdkEventDrivenAppStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const esBuildSettings = {
      sourceMap: true,
      minify: true,
    };

    const envVariables = {
      AWS_ACCOUNT_ID: Stack.of(this).account,
    };

    const lambdaFnProps = {
      handler: "index.handler",
      runtime: Runtime.NODEJS_20_X,
      memorySize: 256,
      environment: {
        ...envVariables,
      },
      logRetention: RetentionDays.ONE_WEEK,
      tracing: Tracing.ACTIVE,
      bundling: esBuildSettings,
    };

    // Define a new API Gateway REST API resource
    const api = new RestApi(this, `${id}-API`, {
      restApiName: "API Gateway for the Platform X",
      description: "This service provides backend APIs for Platform X",
      deploy: true,
      defaultCorsPreflightOptions: {
        allowMethods: [
          "OPTIONS",
          "HEAD",
          "GET",
          "POST",
          "PUT",
          "PATCH",
          "DELETE",
        ],
        allowCredentials: true,
        allowOrigins: ["*"],
      },
    });

    api.root.addMethod("ANY");

    const restApiId = new CfnOutput(this, `${id}-Root-Id`, {
      value: api.restApiId,
      description: `The API Gateway Root id of the ${id}`,
      exportName: `${id}-Root-Id`,
    }).importValue;

    const rootResourceId = new CfnOutput(this, `${id}-Resource-Id`, {
      value: api.root.resourceId,
      description: `The API Gateway Root resource id of the ${id}`,
      exportName: `${id}-Resource-Id`,
    }).importValue;

    const url = new CfnOutput(this, `${id}-API-url`, {
      value: api.url,
      description: `The API Gateway API url of the ${id}`,
      exportName: `${id}-API-url`,
    }).importValue;

    const healthStack = new HealthStack(this, "Health", {
      apiGw: {
        restApiId,
        rootResourceId,
        url,
      },
      lambdaFnProps,
    });

    healthStack.node.addDependency(api);
  }
}
