/* eslint-disable no-duplicate-imports */
import type { StackProps } from "aws-cdk-lib";
import { Stack } from "aws-cdk-lib";

import type { Construct } from "constructs";
import { Runtime, Tracing } from "aws-cdk-lib/aws-lambda";
import { RetentionDays } from "aws-cdk-lib/aws-logs";

import { ApiGatewayStack } from "./apiGateway.stack";

import { HealthStack } from "../src/health/health.stack";
import { OnboardingStack } from "../src/onboarding/onboarding.stack";

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

    const {
      gw: { restApi, baseUrl, rootResourceId, restApiId },
    } = new ApiGatewayStack(this, `${id}-Gw`);

    const healthStack = new HealthStack(this, "Health", {
      apiGw: { baseUrl, rootResourceId, restApiId },
      lambdaFnProps,
    });

    const onboardingStack = new OnboardingStack(this, "Onboarding", {
      apiGw: { baseUrl, rootResourceId, restApiId },
      lambdaFnProps,
    });

    healthStack.node.addDependency(restApi);
    onboardingStack.node.addDependency(restApi);
  }
}
